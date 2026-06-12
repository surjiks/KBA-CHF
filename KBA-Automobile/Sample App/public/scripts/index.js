const updateResults = (message, isJson = false, forceShowDelete = false) => {
    const display = document.getElementById("resultsDisplay");
    const org = document.getElementById("orgSelect").value;

    if (isJson) {
        // Handle potential nested 'data' wrappers
        let data = message.data ? (typeof message.data === 'string' ? JSON.parse(message.data) : message.data) : message;

        let items = Array.isArray(data) ? data : [data];
        let html = "";

        items.forEach((item, index) => {
            html += `<div style="border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 1rem; margin-bottom: 1rem;">`;
            html += `<pre>${JSON.stringify(item, null, 2)}</pre>`;

            // Show delete button if Org1 is active and it's a car asset
            if (org === "org1" && item.CarId) {
                html += `<button class="primary" style="background:#ef4444; color:white; width:auto; padding: 0.4rem 1rem; margin: 0.5rem 0;" onclick="deleteData('${item.CarId}')">Delete Asset ${item.CarId}</button>`;
            }
            html += `</div>`;
        });

        display.innerHTML = html || "// No data found";
    } else {
        display.innerHTML = `<div style="padding: 1rem;">${message}</div>`;
    }
};

const addData = async (event) => {
    event.preventDefault();
    const org = document.getElementById("orgSelect").value;
    const carId = document.getElementById("carId").value;
    const make = document.getElementById("make").value;
    const model = document.getElementById("model").value;
    const color = document.getElementById("color").value;
    const dateOfManufacture = document.getElementById("dateOfManufacture").value;
    const manufacturerName = document.getElementById("manufacturerName").value;

    const carData = {
        carId,
        make,
        model,
        color,
        dateOfManufacture,
        manufacturerName,
    };

    if (!carId || !make || !model || !color || !dateOfManufacture || !manufacturerName) {
        return updateResults("Error: Please fill all fields properly.");
    }

    updateResults(`Submitting transaction as ${org}...`);

    try {
        const response = await fetch("/api/car", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "X-Organization": org
            },
            body: JSON.stringify(carData),
        });

        if (response.ok) {
            const data = await response.json();
            updateResults(`Success: Car ${carId} registered by ${org}.`, true);
        } else {
            const error = await response.json();
            updateResults(`Error: ${error.message || "Failed to create car"}`);
        }
    } catch (err) {
        updateResults(`Error: ${err.message}`);
    }
};

const readData = async (event) => {
    event.preventDefault();
    const org = document.getElementById("orgSelect").value;
    const carId = document.getElementById("carIdInput").value;

    if (!carId) {
        return updateResults("Error: Please enter a valid Car ID.");
    }

    updateResults(`Querying ledger as ${org}...`);

    try {
        const response = await fetch(`/api/car/${carId}`, {
            headers: { "X-Organization": org }
        });
        const responseData = await response.json();

        if (response.ok) {
            updateResults(responseData, true);
        } else {
            updateResults(`Error: ${responseData.message || "Asset not found"}`);
        }
    } catch (err) {
        updateResults(`Error: ${err.message}`);
    }
};

const getAllData = async (event) => {
    if (event) event.preventDefault();
    const org = document.getElementById("orgSelect").value;

    updateResults(`Fetching all assets as ${org}...`);

    try {
        const response = await fetch("/api/cars", {
            headers: { "X-Organization": org }
        });
        const responseData = await response.json();

        if (response.ok) {
            updateResults(responseData, true);
        } else {
            updateResults(`Error: ${responseData.message || "Failed to fetch assets"}`);
        }
    } catch (err) {
        updateResults(`Error: ${err.message}`);
    }
};

const deleteData = async (carId) => {
    if (!confirm(`Are you sure you want to delete car ${carId}?`)) return;

    const org = document.getElementById("orgSelect").value;
    updateResults(`Deleting car ${carId} as ${org}...`);

    try {
        const response = await fetch(`/api/car/${carId}`, {
            method: "DELETE",
            headers: { "X-Organization": org }
        });
        const data = await response.json();

        if (response.ok) {
            updateResults(`Success: ${data.message}`);
            // Briefly wait then refresh list
            setTimeout(() => getAllData(), 1500);
        } else {
            updateResults(`Error: ${data.message || "Failed to delete"}`);
        }
    } catch (err) {
        updateResults(`Error: ${err.message}`);
    }
};