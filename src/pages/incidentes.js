document.addEventListener('DOMContentLoaded', () => {

    const incidentsData = [
        { id: 1, type: 'Incendio', description: 'Incendio en una casa', location: 'Renca, El Montijo 2212', dateTime: '03/09/2024 22:50', status: 'En progreso', imageUrl: '../assets/incendio.png' },
        { id: 2, type: 'Explosión', description: 'Explosión de transf...', location: 'Renca, El Montijo 2212', dateTime: '03/09/2024 14:20', status: 'Cerrado', imageUrl: '../assets/default_incident.png' },
        { id: 3, type: 'Accidente', description: 'Atropellamiento', location: 'Av. Vicuña Mackenna 6100', dateTime: '03/09/2024 13:15', status: 'Cerrado', imageUrl: '../assets/accidente.png' },
        { id: 4, type: 'Accidente', description: 'Colisión múltiple en vía', location: 'Autopista Central, Santiago', dateTime: '03/09/2024 12:50', status: 'En progreso', imageUrl: '../assets/accidente.png' },
        { id: 5, type: 'Fuga de gas', description: 'Fuga en cocina res...', location: 'Av. Providencia 1234, Providencia', dateTime: '03/09/2024 12:25', status: 'Localizado', imageUrl: '../assets/fuga-gas.png' },
        { id: 6, type: 'Incendio', description: 'Fuego en almacén...', location: 'Av. Santa Rosa 1300, Santiago', dateTime: '03/09/2024 12:00', status: 'Cerrado', imageUrl: '../assets/incendio.png' },
        { id: 7, type: 'Fuga de gas', description: 'Fuga en instituto', location: 'Huechuraba, la calle 2212', dateTime: '03/09/2024 11:50', status: 'Cerrado', imageUrl: '../assets/fuga-gas.png' },
        { id: 8, type: 'Accidente', description: 'Colisión múltiple en vía', location: 'Av. Américo Vespucio, Las Condes', dateTime: '03/09/2024 09:30', status: 'Cerrado', imageUrl: '../assets/accidente.png' },
        { id: 9, type: 'Derrumbe', description: 'Colapso de estructura', location: 'Av. Santa Rosa 1300, Santiago', dateTime: '03/09/2024 09:50', status: 'En progreso', imageUrl: '../assets/derrumbe.png' },
        { id: 10, type: 'Incendio', description: 'Incendio en una casa', location: 'Av. Macul 4700, Macul', dateTime: '03/09/2024 09:50', status: 'En progreso', imageUrl: '../assets/incendio.png' },
        { id: 11, type: 'Derrame químico', description: 'Derrame de líquidos', location: 'Av. Américo Vespucio Las Condes', dateTime: '03/09/2024 09:22', status: 'En progreso', imageUrl: '../assets/derrame-quimico.png' },
        { id: 12, type: 'Incendio', description: 'Incendio forestal', location: 'Av. La Florida 9600, La Florida', dateTime: '03/09/2024 08:57', status: 'Cerrado', imageUrl: '../assets/incendio.png' },
        { id: 13, type: 'Accidente', description: 'Atropellamiento', location: 'Av. Quilín 4500, Ñuñoa', dateTime: '03/09/2024 08:55', status: 'Cerrado', imageUrl: '../assets/accidente.png' },
        { id: 14, type: 'Explosión', description: 'Explosión de horno', location: 'Av. Manquehue Norte 1400, Santiago', dateTime: '03/09/2024 08:22', status: 'Cerrado', imageUrl: '../assets/default_incident.png' },
        { id: 15, type: 'Desplome', description: 'Árbol caído', location: 'Av. Irarrazaval 5200, Ñuñoa', dateTime: '03/09/2024 06:52', status: 'En progreso', imageUrl: '../assets/default_incident.png' },
        { id: 16, type: 'Explosión', description: 'Explosión de tuberías', location: 'Av. Los Leones 2200, Providencia', dateTime: '03/09/2024 05:40', status: 'Cerrado', imageUrl: '../assets/default_incident.png' },
    ];

    const updateButton = document.getElementById('btnActualizar');
    const tableBody = document.getElementById('incidentTableBody');
    const showFormBtn = document.getElementById('showFormBtn');
    const addIncidentForm = document.getElementById('addIncidentForm');
    const cancelFormBtn = document.getElementById('cancelFormBtn');

    function generateIncidentId() {
        const incidents = JSON.parse(localStorage.getItem('incidentes')) || [];
        const maxId = incidents.reduce((max, inc) => Math.max(max, inc.id), 0);
        return maxId + 1;
    }

    function saveIncidentsToLocalStorage(data) {
        localStorage.setItem('incidentes', JSON.stringify(data));
    }

    function loadAndDisplayIncidents() {
        tableBody.innerHTML = '';
        const incidents = JSON.parse(localStorage.getItem('incidentes'));

        if (incidents) {
            const sortedIncidents = incidents.sort((a, b) => b.id - a.id);

            sortedIncidents.forEach(incident => {
                const mainRow = document.createElement('tr');
                mainRow.classList.add('incident-row');
                mainRow.innerHTML = `
                    <td>${incident.id}</td>
                    <td>${incident.type}</td>
                    <td>${incident.location}</td>
                    <td>${incident.status}</td>
                    <td><button class="expand-btn">Ver Detalles</button></td>
                `;
                tableBody.appendChild(mainRow);

                const detailRow = document.createElement('tr');
                detailRow.classList.add('incident-details');
                detailRow.style.display = 'none';
                detailRow.innerHTML = `
                    <td colspan="5">
                        <div class="details-container">
                            <div class="details-text">
                                <p><strong>Descripción:</strong> ${incident.description}</p>
                                <p><strong>Fecha y Hora:</strong> ${incident.dateTime}</p>
                                <img src="${incident.imageUrl}" alt="Imagen del incidente">
                            </div>
                            <div class="details-actions">
                                <button class="btn btn-primary edit-incident-btn" data-id="${incident.id}">Editar</button>
                            </div>
                        </div>
                    </td>
                `;
                tableBody.appendChild(detailRow);
            });
        }
    }

    // Asignación de eventos delegados a la tabla (tableBody)
    tableBody.addEventListener('click', (event) => {
        const target = event.target;

        // Maneja el clic en el botón "Ver Detalles"
        if (target.classList.contains('expand-btn')) {
            const detailRow = target.closest('tr').nextElementSibling;
            const isVisible = detailRow.style.display === 'table-row';
            detailRow.style.display = isVisible ? 'none' : 'table-row';
            target.textContent = isVisible ? 'Ver Detalles' : 'Ocultar';
        }

        // Maneja el clic en el botón "Editar"
        if (target.classList.contains('edit-incident-btn')) {
            const incidentId = parseInt(target.dataset.id);
            editIncident(incidentId);
        }

        // Maneja el clic en el botón "Guardar"
        if (target.classList.contains('save-incident-btn')) {
            const incidentId = parseInt(target.dataset.id);
            saveIncident(incidentId);
        }

        // Maneja el clic en el botón "Cancelar"
        if (target.classList.contains('cancel-edit-btn')) {
            loadAndDisplayIncidents();
        }
    });

    function editIncident(id) {
        const incidents = JSON.parse(localStorage.getItem('incidentes'));
        const incident = incidents.find(inc => inc.id === id);

        if (!incident) return;

        const detailRow = document.querySelector(`.edit-incident-btn[data-id="${id}"]`).closest('tr').parentElement.querySelector(`.incident-details`);
        const detailsContainer = detailRow.querySelector('.details-container');

        detailsContainer.innerHTML = `
            <div class="edit-text">
                <label>Descripción:</label><br>
                <textarea id="edit-description" class="form-control">${incident.description}</textarea><br>

                <label>Ubicación:</label><br>
                <input type="text" id="edit-location" class="form-control" value="${incident.location}"><br>

                <label>Tipo:</label><br>
                <input type="text" id="edit-type" class="form-control" value="${incident.type}"><br>

                <label>Estado:</label><br>
                <input type="text" id="edit-status" class="form-control" value="${incident.status}"><br>

                <label>URL de Imagen:</label><br>
                <input type="url" id="edit-image-url" class="form-control" value="${incident.imageUrl}"><br>
            </div>
            <div class="details-actions">
                <button class="btn btn-success save-incident-btn" data-id="${id}">Guardar</button>
                <button class="btn btn-danger cancel-edit-btn" data-id="${id}">Cancelar</button>
            </div>
        `;
    }

    function saveIncident(id) {
        let incidents = JSON.parse(localStorage.getItem('incidentes'));
        const incidentIndex = incidents.findIndex(inc => inc.id === id);

        if (incidentIndex === -1) return;

        const newDescription = document.getElementById('edit-description').value;
        const newLocation = document.getElementById('edit-location').value;
        const newType = document.getElementById('edit-type').value;
        const newStatus = document.getElementById('edit-status').value;
        const newImageUrl = document.getElementById('edit-image-url').value;

        incidents[incidentIndex].description = newDescription;
        incidents[incidentIndex].location = newLocation;
        incidents[incidentIndex].type = newType;
        incidents[incidentIndex].status = newStatus;
        incidents[incidentIndex].imageUrl = newImageUrl;

        saveIncidentsToLocalStorage(incidents);
        loadAndDisplayIncidents();
    }

    if (!localStorage.getItem('incidentes')) {
        saveIncidentsToLocalStorage(incidentsData);
    }

    updateButton.addEventListener('click', loadAndDisplayIncidents);

    showFormBtn.addEventListener('click', () => {
        addIncidentForm.style.display = 'block';
    });

    cancelFormBtn.addEventListener('click', () => {
        addIncidentForm.style.display = 'none';
        addIncidentForm.reset();
    });

    addIncidentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const incidentType = document.getElementById('incidentType').value;
        const incidentDescription = document.getElementById('incidentDescription').value;
        const incidentLocation = document.getElementById('incidentLocation').value;
        const incidentImageUrl = document.getElementById('incidentImageUrl').value || '../assets/default_incident.png';

        const now = new Date();
        const dateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;

        const newIncident = {
            id: generateIncidentId(),
            type: incidentType,
            description: incidentDescription,
            location: incidentLocation,
            dateTime: dateTime,
            status: 'En progreso',
            imageUrl: incidentImageUrl
        };

        const incidents = JSON.parse(localStorage.getItem('incidentes')) || [];
        incidents.push(newIncident);
        saveIncidentsToLocalStorage(incidents);
        addIncidentForm.reset();
        addIncidentForm.style.display = 'none';
        loadAndDisplayIncidents();
        alert('¡Incidente añadido correctamente!');
    });
});