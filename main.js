const jsonForm = document.querySelector('#jsonform');
const csvForm = document.querySelector('#csvForm');
const bConvert = document.querySelector('#bConvert');
const bDownload = document.querySelector('#bDownload');
const bDownloadXlsx = document.querySelector('#bDownloadXlsx');
// funcion de boton
bConvert.addEventListener('click', e => {
    convertJsontoCSV();
})
//funcion para convertir json
function convertJsontoCSV(){
    let json;
    let keys = [];
    let values = [];
    
    try {
        json = JSON.parse(jsonForm.value);
    } catch (error) {
        console.log('Formato incorrecto JSON', error);
        alert('Formato incorrecto JSON');
    }

    if(Array.isArray(json)){
        json.forEach(item=>{
            const nkeys = Object.keys(item);

            if(keys.length === 0){
                keys = [...nkeys];
            }else{
                if(nkeys.length !== keys.length){
                    throw new Error('Numero de keys es diferecte');
                }else{
                    console.log('OK', nkeys);
                }
            }
            const row = keys.map(k => {
                return item[k];
            });
            values.push([...row]);
        });
        console.log(keys,values);
        values.unshift(keys);
        const text = values.map(v => v.join(',')).join('\n');
        csvForm.value = text;
    }else{
        alert('No es en arreglo de objetos')
    }

    bDownload.addEventListener('click', e => {
        downloadCSV();
    })


    function downloadCSV() {
        // Obtener el contenido del textarea
        var csvContent = document.getElementById('csvForm').value;
    
        // Crear un elemento <a> para el archivo CSV
        var downloadLink = document.createElement('a');
        downloadLink.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csvContent));
        downloadLink.setAttribute('download', 'data.csv');
        downloadLink.style.display = 'none';
    
        // Agregar el enlace al documento
        document.body.appendChild(downloadLink);
    
        // Hacer clic en el enlace para descargar el archivo
        downloadLink.click();
    
        // Eliminar el enlace del documento
        document.body.removeChild(downloadLink);
    }

    bDownloadXlsx.addEventListener('click', e => {
        downloadXLSX();
    })

    function downloadXLSX() {
        var csvData = document.getElementById('csvForm').value;
    
        // Convertir el contenido CSV a una matriz de objetos
        var csvArray = csvData.split('\n').map(row => row.split(','));
        var headers = csvArray[0];
        var data = csvArray.slice(1);
    
        var worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
        var workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet 1');
    
        // Convertir el libro de trabajo a un archivo XLSX
        var excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    
        // Crear un Blob a partir del buffer de Excel
        var blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
        // Crear un enlace para descargar el archivo XLSX
        var downloadLink = document.createElement('a');
        downloadLink.href = URL.createObjectURL(blob);
        downloadLink.download = 'data.xlsx';
        downloadLink.style.display = 'none';
    
        // Agregar el enlace al documento
        document.body.appendChild(downloadLink);
    
        // Hacer clic en el enlace para descargar el archivo
        downloadLink.click();
    
        // Eliminar el enlace del documento
        document.body.removeChild(downloadLink);
    }
}
