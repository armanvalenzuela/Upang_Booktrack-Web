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

// FOR FETCHING ALL OF THE LOWSTOCK ITEMS (<50)
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

        // Add this after fetching low stock data
        const departmentFilterLowStock = document.querySelectorAll('#lowstock .header-select')[1];
        if (departmentFilterLowStock) {
            departmentFilterLowStock.addEventListener("change", filterLowStockByDepartment);
        }

        const nameFilterLowStock = document.querySelectorAll('#lowstock .header-select')[2];
        if (nameFilterLowStock) {
            nameFilterLowStock.addEventListener("change", filterLowStockByName);
        }

        const genderFilterLowStock = document.querySelectorAll('#lowstock .header-select')[3];
        if (genderFilterLowStock) {
            genderFilterLowStock.addEventListener("change", filterLowStockByGender);
        }

        const sizeFilterLowStock = document.querySelectorAll('#lowstock .header-select')[4];
        if (sizeFilterLowStock) {
            sizeFilterLowStock.addEventListener("change", filterLowStockBySize);
        }

        const stockFilterLowStock = document.querySelectorAll('#lowstock .header-select')[5];
        if (stockFilterLowStock) {
            stockFilterLowStock.addEventListener("change", sortLowStockByStock);
        }

        function filterLowStockByDepartment() {
            const selectedDepartment = departmentFilterLowStock.value.toLowerCase();

            const table = document.getElementById('lowstock');
            const rows = table.querySelectorAll('tr');

            // Start from index 2 to skip the header rows
            for (let i = 2; i < rows.length; i++) {
                const department = rows[i].querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                // Show all rows if no department is selected
                if (!selectedDepartment) {
                    rows[i].style.display = "";
                    continue;
                }

                // Show only rows that match the selected department
                rows[i].style.display = department === selectedDepartment ? "" : "none";
            }
        }

        function filterLowStockByName() {
            const selectedName = nameFilterLowStock.value.toLowerCase();

            const table = document.getElementById('lowstock');
            const rows = table.querySelectorAll('tr');

            // Start from index 2 to skip the header rows
            for (let i = 2; i < rows.length; i++) {
                const name = rows[i].querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                // Show all rows if no name is selected
                if (!selectedName) {
                    rows[i].style.display = "";
                    continue;
                }

                // Show only rows that match the selected name
                rows[i].style.display = name === selectedName ? "" : "none";
            }
        }

        function filterLowStockByGender() {
            const selectedGender = genderFilterLowStock.value.toLowerCase();

            const table = document.getElementById('lowstock');
            const rows = table.querySelectorAll('tr');

            // Start from index 2 to skip the header rows
            for (let i = 2; i < rows.length; i++) {
                const gender = rows[i].querySelector('td:nth-child(4)').textContent.toLowerCase();
                
                // Show all rows if no gender is selected
                if (!selectedGender) {
                    rows[i].style.display = "";
                    continue;
                }

                // Show only rows that match the selected gender
                rows[i].style.display = gender === selectedGender ? "" : "none";
            }
        }

        function filterLowStockBySize() {
            const selectedSize = sizeFilterLowStock.value.toLowerCase();

            const table = document.getElementById('lowstock');
            const rows = table.querySelectorAll('tr');

            // Start from index 2 to skip the header rows
            for (let i = 2; i < rows.length; i++) {
                const size = rows[i].querySelector('td:nth-child(5)').textContent.toLowerCase();
                
                // Show all rows if no size is selected
                if (!selectedSize) {
                    rows[i].style.display = "";
                    continue;
                }

                // Show only rows that match the selected size
                rows[i].style.display = size === selectedSize ? "" : "none";
            }
        }

        function sortLowStockByStock() {
            const sortOrder = stockFilterLowStock.value;
            const table = document.getElementById('lowstock');
            const rows = Array.from(table.querySelectorAll('tr')).slice(2); // Skip header rows

            rows.sort((a, b) => {
                const stockA = parseInt(a.querySelector('td:nth-child(6)').textContent);
                const stockB = parseInt(b.querySelector('td:nth-child(6)').textContent);

                if (sortOrder === "asc") {
                    return stockA - stockB;
                } else if (sortOrder === "desc") {
                    return stockB - stockA;
                }
                return 0;
            });

            // Re-append sorted rows
            rows.forEach(row => table.appendChild(row));
        }
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
                <th>Stock&nbsp;&nbsp;</th> <!-- Removed filtering dropdown -->
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

        // Add this after fetching out of stock data
        const departmentFilterOutStock = document.querySelectorAll('#outstock .header-select')[1];
        if (departmentFilterOutStock) {
            departmentFilterOutStock.addEventListener("change", filterOutStockByDepartment);
        }

        const nameFilterOutStock = document.querySelectorAll('#outstock .header-select')[2];
        if (nameFilterOutStock) {
            nameFilterOutStock.addEventListener("change", filterOutStockByName);
        }

        const genderFilterOutStock = document.querySelectorAll('#outstock .header-select')[3];
        if (genderFilterOutStock) {
            genderFilterOutStock.addEventListener("change", filterOutStockByGender);
        }

        const sizeFilterOutStock = document.querySelectorAll('#outstock .header-select')[4];
        if (sizeFilterOutStock) {
            sizeFilterOutStock.addEventListener("change", filterOutStockBySize);
        }

        const stockFilterOutStock = document.querySelectorAll('#outstock .header-select')[5];
        if (stockFilterOutStock) {
            stockFilterOutStock.addEventListener("change", sortOutStockByStock);
        }

        function filterOutStockByDepartment() {
            const selectedDepartment = departmentFilterOutStock.value.toLowerCase();

            const table = document.getElementById('outstock');
            const rows = table.querySelectorAll('tr');

            // Start from index 2 to skip the header rows
            for (let i = 2; i < rows.length; i++) {
                const department = rows[i].querySelector('td:nth-child(2)').textContent.toLowerCase();
                
                // Show all rows if no department is selected
                if (!selectedDepartment) {
                    rows[i].style.display = "";
                    continue;
                }

                // Show only rows that match the selected department
                rows[i].style.display = department === selectedDepartment ? "" : "none";
            }
        }

        function filterOutStockByName() {
            const selectedName = nameFilterOutStock.value.toLowerCase();

            const table = document.getElementById('outstock');
            const rows = table.querySelectorAll('tr');

            // Start from index 2 to skip the header rows
            for (let i = 2; i < rows.length; i++) {
                const name = rows[i].querySelector('td:nth-child(3)').textContent.toLowerCase();
                
                // Show all rows if no name is selected
                if (!selectedName) {
                    rows[i].style.display = "";
                    continue;
                }

                // Show only rows that match the selected name
                rows[i].style.display = name === selectedName ? "" : "none";
            }
        }

        function filterOutStockByGender() {
            const selectedGender = genderFilterOutStock.value.toLowerCase();

            const table = document.getElementById('outstock');
            const rows = table.querySelectorAll('tr');

            // Start from index 2 to skip the header rows
            for (let i = 2; i < rows.length; i++) {
                const gender = rows[i].querySelector('td:nth-child(4)').textContent.toLowerCase();
                
                // Show all rows if no gender is selected
                if (!selectedGender) {
                    rows[i].style.display = "";
                    continue;
                }

                // Show only rows that match the selected gender
                rows[i].style.display = gender === selectedGender ? "" : "none";
            }
        }

        function filterOutStockBySize() {
            const selectedSize = sizeFilterOutStock.value.toLowerCase();

            const table = document.getElementById('outstock');
            const rows = table.querySelectorAll('tr');

            // Start from index 2 to skip the header rows
            for (let i = 2; i < rows.length; i++) {
                const size = rows[i].querySelector('td:nth-child(5)').textContent.toLowerCase();
                
                // Show all rows if no size is selected
                if (!selectedSize) {
                    rows[i].style.display = "";
                    continue;
                }

                // Show only rows that match the selected size
                rows[i].style.display = size === selectedSize ? "" : "none";
            }
        }

        function sortOutStockByStock() {
            const sortOrder = stockFilterOutStock.value;
            const table = document.getElementById('outstock');
            const rows = Array.from(table.querySelectorAll('tr')).slice(2); // Skip header rows

            rows.sort((a, b) => {
                const stockA = parseInt(a.querySelector('td:nth-child(6)').textContent);
                const stockB = parseInt(b.querySelector('td:nth-child(6)').textContent);

                if (sortOrder === "asc") {
                    return stockA - stockB;
                } else if (sortOrder === "desc") {
                    return stockB - stockA;
                }
                return 0;
            });

            // Re-append sorted rows
            rows.forEach(row => table.appendChild(row));
        }
    })
    .catch(error => console.error('Error fetching out-of-stock data:', error));

