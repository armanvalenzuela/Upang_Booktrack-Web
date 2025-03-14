// FETCHING COUNT OF BOOKS, UNIF, AND USERS
fetch('http://localhost/UPBooktrack/admin_get_info.php')
    .then(response => response.json())
    .then(data => {
        document.querySelector('.bookavailability').innerHTML = `
            <strong> <p id="textbooksavail">Books Available</p> </strong>
            <img class="bookicon" src="Images/bookicon.png"><br/><br/>
            <h1>&nbsp; &nbsp;${data.books}</h1>
        `;

        document.querySelector('.uniformavailability').innerHTML = `
            <strong> <p>Uniforms Available</p> </strong>
            <img class="uniformicon" src="Images/uniformlogo.png"><br/><br/>
            <h1>&nbsp; &nbsp;${data.uniforms}</h1>
        `;

        document.querySelector('.profile-user').innerHTML = `
            <strong> <p>Total Users</p> </strong>
            <img class="usericon" src="Images/profile-user.png"><br/><br/>
            <h1>&nbsp; &nbsp;${data.users}</h1>
        `;
    })
    .catch(error => console.error('Error fetching data:', error));

// FOR FETCHING ALL OF THE LOWSTOCK ITEMS (<25)
fetch('http://localhost/UPBooktrack/admin_get_lowstock.php')
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('lowstock');
        
        // CLEAR ROWS ESCEPT HEADERS
        table.innerHTML = `
            <tr>
                <th colspan="6" bgcolor="white">Low Stock</th>
            </tr>
            <tr>
                <th>Type</th>
                <th>Department</th>
                <th>Name</th>
                <th>Gender</th>
                <th>Size</th>
                <th>Stock</th>
            </tr>
        `;

        // LOOP THROUGH THE RESPONSE AND ADD THEM AS TABLES CELLS
        data.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.type}</td>
                <td>${item.department}</td>
                <td>${item.name}</td>
                <td>${item.gender}</td>
                <td>${item.size}</td>
                <td>${item.stock}</td>
            `;
            table.appendChild(row);
        });
    })
    .catch(error => console.error('Error fetching low stock data:', error));
