$('body').on('click', '#getAllMappings', function () {

    const dealer_id = document.getElementById('dealerID').value;
    const mappingType = document.getElementById('mappingType').value;
    const sourceColumn = document.getElementById('sourceColumn').value;
    const dashboardColumn = document.getElementById('dashboardColumn').value;
    const sourceFileName = document.getElementById('sourceFileName').value;
    const destinationFileName = document.getElementById('destinationFileName').value;
    const validationMethod = document.getElementById('validationMethod').value;

    if (dealer_id === '') {
        alert('Provide Dealer ID');
        return;
    } else if (mappingType === '') {
        alert('Provide Dealer ID');
        return;
    } else if (sourceColumn === '') {
        alert('Provide Dealer ID');
        return;
    } else if (dashboardColumn === '') {
        alert('Provide Dealer ID');
        return;
    } else if (sourceFileName === '') {
        alert('Provide Dealer ID');
        return;
    } else if (destinationFileName === '') {
        alert('Provide Dealer ID');
        return;
    }

    // console.log({ dealer_id, mappingType, sourceColumn, dashboardColumn, sourceFileName, destinationFileName, validationMethod });
    // return;
    fetch(`/getAllMappings?id=${dealer_id}&mT=${mappingType}&sC=${sourceColumn}&dC=${dashboardColumn}&sFN=${sourceFileName}&dFN=${destinationFileName}&vM=${validationMethod}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                alert(data.error)
            } else {

                // Assuming you have received the response as 'data' variable
                const dataTable = document.getElementById('data-table');
                const tbody = dataTable.querySelector('tbody');
                tbody.textContent = '';

                // Loop over the 'data' array and generate table rows
                data.mappingres.forEach(item => {
                    console.log(item);
                    const tr = document.createElement('tr');

                    const indexCell = document.createElement('td');
                    indexCell.textContent = item.ndx;
                    tr.appendChild(indexCell);

                    const stockCell = document.createElement('td');
                    stockCell.textContent = item.stock;
                    tr.appendChild(stockCell);

                    const isFoundCell = document.createElement('td');
                    isFoundCell.textContent = item.is_found;
                    if (item.is_found) {
                        isFoundCell.classList.add('green');
                    } else {
                        isFoundCell.classList.add('bg-danger');
                    }
                    tr.appendChild(isFoundCell);

                    const manufacturerInSrcCell = document.createElement('td');
                    manufacturerInSrcCell.textContent = item.manufacturer_in_src;
                    tr.appendChild(manufacturerInSrcCell);

                    const mappingCell = document.createElement('td');
                    mappingCell.textContent = item.mapping;
                    mappingCell.classList.add(item.mapping === '' ? 'bg-danger' : 'bg-present');
                    tr.appendChild(mappingCell);

                    const manufacturerInDestCell = document.createElement('td');
                    manufacturerInDestCell.textContent = item.manufacturer_in_dest;
                    tr.appendChild(manufacturerInDestCell);

                    const issueCell = document.createElement('td');
                    issueCell.textContent = item.issue;
                    if (item.issue) {
                        issueCell.classList.add('bg-danger');
                    }
                    tr.appendChild(issueCell);

                    tbody.appendChild(tr);
                });

            }
        })
    })


})