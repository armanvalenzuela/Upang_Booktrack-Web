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
                <th><select class="header-select">
                                <option value="">Type </option>
                                <option value="book">Book</option>
                                <option value="uniform">Uniform</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Department </option>
                                <option value="CITE">CITE</option>
                                <option value="CMA">CMA</option>
                                <option value="CAHS">CAHS</option>
                                <option value="CEA">CEA</option>
                                <option value="CCJE">CCJE</option>
                                <option value="CAS">CAS</option>
                                <option value="SHS">SHS</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Name </option>
                                <option value="asc">A to Z</option>
                                <option value="desc">Z to A</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Gender </option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Size </option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="2XL">2XL</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Stock </option>
                                <option value="asc">Low to High</option>
                                <option value="desc">High to Low</option>
                            </select></th>
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

// FOR FETCHING OUT OF STOCK ITEMS

// FOR FETCHING ALL OF THE OUT OF STOCK ITEMS (STOCK = 0)
fetch('http://localhost/UPBooktrack/admin_get_outOfstock.php')
    .then(response => response.json())
    .then(data => {
        const table = document.getElementById('outstock');

        // CLEAR ROWS EXCEPT HEADERS
        table.innerHTML = `
            <tr>
                <th colspan="6" bgcolor="white">Out of Stock</th>
            </tr>
            <tr>
                <th><select class="header-select">
                                <option value="">Type </option>
                                <option value="book">Book</option>
                                <option value="uniform">Uniform</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Department </option>
                                <option value="CITE">CITE</option>
                                <option value="CMA">CMA</option>
                                <option value="CAHS">CAHS</option>
                                <option value="CEA">CEA</option>
                                <option value="CCJE">CCJE</option>
                                <option value="CAS">CAS</option>
                                <option value="SHS">SHS</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Name </option>
                                <option value="asc">A to Z</option>
                                <option value="desc">Z to A</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Gender </option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Size </option>
                                <option value="XS">XS</option>
                                <option value="S">S</option>
                                <option value="M">M</option>
                                <option value="L">L</option>
                                <option value="XL">XL</option>
                                <option value="2XL">2XL</option>
                            </select></th>
                <th><select class="header-select">
                                <option value="">Stock </option>
                                <option value="asc">Low to High</option>
                                <option value="desc">High to Low</option>
                            </select>
                        </th></th>
            </tr>
        `;

        // LOOP THROUGH THE RESPONSE AND ADD THEM AS TABLE ROWS
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
    .catch(error => console.error('Error fetching out-of-stock data:', error));

