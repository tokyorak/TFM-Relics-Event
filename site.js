window.onload = function () {
    // create relic forms
    var relics = ['A', 'B', 'C', 'D', 'E', 'F'];

    relics.forEach(function (relic) {
        // create a div and buttons for each relic type
        var relicDiv = document.getElementById('relics' + relic);
        var checkAllButton = document.createElement('button');
        var resetButton = document.createElement('button');

        checkAllButton.textContent = 'Check All';
        checkAllButton.className = 'checkbox-item';

        resetButton.textContent = 'Reset ' + relic;
        resetButton.className = 'checkbox-item';

        checkAllButton.addEventListener('click', function () {
            checkOrResetLine(relic, true);
        });

        resetButton.addEventListener('click', function () {
            checkOrResetLine(relic, false);
        });

        relicDiv.appendChild(checkAllButton);
        relicDiv.appendChild(resetButton);
        
        for(var i = 1; i <= 10; ++i)
        {
            // don't do innerHTML after appending the buttons, event listeners will be lost since innerHTML recreates the DOM from scratch
            // relicDiv.innerHTML += createRelicForm(relic, i);
            var relicForm = createRelicForm(relic, i);
            var wrapper = document.createElement('div');
            wrapper.innerHTML = relicForm;
            relicDiv.appendChild(wrapper.firstElementChild);
        }
        
    });

    // Attach event listeners to checkboxes
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    for(var i = 0; i < checkboxes.length; ++i)
    {
        var checkbox = checkboxes[i];
        // restore the state of the checkbox
        checkbox.checked = localStorage.getItem(checkbox.id) === 'true';

        checkboxes[i].addEventListener('change', function(){
            // save the state of the checkbox whenever it changes
            localStorage.setItem(this.id, this.checked);
            // refresh the relics location table after a checkbox is changed
            displayRelicsByMap();
        });
    }

    // reset button for all relics
    document.getElementById('reset-button').addEventListener('click', function(){
        relics.forEach(function(relic){
            checkOrResetLine(relic, false);
        });
    });

    displayRelicsByMap();
};

function createRelicForm(group, number){
    return `
        <div class="checkbox-item relic">
            <label for = "${group}${number}"> ${group}${number} </label>
            <input type = "checkbox" id = "${group}${number}" name = "${group}${number}">
        </div>
        `;
}

function checkOrResetLine(line, isChecked){
    for(var i = 1; i <= 10; ++i)
    {
        var checkbox = document.getElementById(line + i);
        checkbox.checked = isChecked;
        localStorage.setItem(checkbox.id, checkbox.checked);
    }
    displayRelicsByMap();
}

function findRelicsInMaps(){
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    var notOwnedRelics = [];
    // find the relics that are not owned
    for(var i = 0; i < checkboxes.length; ++i)
    {
        if(!checkboxes[i].checked)
        {
            notOwnedRelics.push(checkboxes[i].id);
        }
    }

    // refactor the previous code to use a better query selector
    // var notOwnedRelics = Array.from(document.querySelectorAll('input[type="checkbox"]:not(:checked)')).map(item => item.id);

    // find the maps that contain the relics that are not owned
    var foundInMaps = {};
    for(var map in maps)
    {
        var mapItems = maps[map];
        var foundItems = mapItems.filter(item => notOwnedRelics.includes(item.Item));
        if(foundItems.length > 0)
        {
            foundInMaps[map] = foundItems;
        }
    }

    return foundInMaps;
}

function displayRelicsByMap(){
    var foundInMaps = findRelicsInMaps();
    var tableHTML = '<table><caption>This will be relics location on each map</caption><tr><th>Map</th><th id="item">Relic</th><th id="location">Location</th></tr>';
    
    for(var map in foundInMaps)
    {
        // get the items for the current map
        var items = foundInMaps[map];

        // sort items by position
        items.sort((a, b) => a.Pos.localeCompare(b.Pos));

        // display the items

        // add a special class for the th element of each map section, so that we can style it differently
        var headerClass = 'map'
        tableHTML += `<tr><th class="${map}" id="${map.toLowerCase()}" rowspan="${items.length + 1}">${map}</th></tr>`;
        for(var i = 0; i < items.length; ++i)
        {
            var locationFullForm = locationDefinitions[items[i].Pos];

            // add a special class for the last row of each map section, so that we can style it differently
            var rowClass = (i === items.length - 1) ? 'last-row' : '';

            tableHTML += `<tr class="${rowClass}"><td headers="item ${map.toLowerCase()}">${items[i].Item}</td><td headers="location ${map.toLowerCase()}">${locationFullForm}</td></tr>`;
        }
    }

    tableHTML += '</table>';
    document.getElementById('relics-location').innerHTML = tableHTML;
}

// Define a mapping from abbreviations to full names
var locationDefinitions = {
    'any': 'Any',
    'TL': 'Top Left',
    'TR': 'Top Right',
    'BL': 'Bottom Left',
    'BR': 'Bottom Right',
    'MID': 'Mid'
};

// list of all possible maps and relic locations within them
var maps = {
    "Ship": [
        { "Item": "B7", "Pos": "any" },
        { "Item": "C3", "Pos": "any" },
        { "Item": "D4", "Pos": "any" },
        { "Item": "D5", "Pos": "any" }
    ],
    "Island": [
        { "Item": "A2", "Pos": "BR" },
        { "Item": "A3", "Pos": "BL" },
        { "Item": "A7", "Pos": "MID" },
        { "Item": "A8", "Pos": "BL" },
        { "Item": "B5", "Pos": "BL" },
        { "Item": "B6", "Pos": "MID" },
        { "Item": "B9", "Pos": "BR" },
        { "Item": "C1", "Pos": "BR" },
        { "Item": "C2", "Pos": "TR" },
        { "Item": "C6", "Pos": "BL" },
        { "Item": "E2", "Pos": "MID" },
        { "Item": "E5", "Pos": "TR" },
        { "Item": "F1", "Pos": "BR" },
        { "Item": "F3", "Pos": "TR" },
        { "Item": "F5", "Pos": "BL" },
        { "Item": "F7", "Pos": "MID" },
        { "Item": "F8", "Pos": "TR" },
        { "Item": "F10", "Pos": "MID" }
    ],
    "Shipwreck": [
        { "Item": "A1", "Pos": "TR" },
        { "Item": "A4", "Pos": "MID" },
        { "Item": "A9", "Pos": "BL" },
        { "Item": "B3", "Pos": "BR" },
        { "Item": "B3", "Pos": "MID" },
        { "Item": "B8", "Pos": "BR" },
        { "Item": "C9", "Pos": "BL" },
        { "Item": "C10", "Pos": "BR" },
        { "Item": "D1", "Pos": "MID" },
        { "Item": "D2", "Pos": "BL" },
        { "Item": "D8", "Pos": "TR" },
        { "Item": "D10", "Pos": "MID" },
        { "Item": "E1", "Pos": "BR" },
        { "Item": "E3", "Pos": "BR" },
        { "Item": "E4", "Pos": "BL" },
        { "Item": "E6", "Pos": "BL" },
        { "Item": "E7", "Pos": "TR" },
        { "Item": "E8", "Pos": "TR" },
        { "Item": "E10", "Pos": "MID" }
    ],
    "Jungle": [
        { "Item": "A5", "Pos": "TR" },
        { "Item": "A6", "Pos": "MID" },
        { "Item": "A10", "Pos": "TL" },
        { "Item": "B1", "Pos": "TR" },
        { "Item": "B2", "Pos": "BL" },
        { "Item": "B10", "Pos": "MID" },
        { "Item": "C4", "Pos": "BL" },
        { "Item": "C5", "Pos": "TR" },
        { "Item": "C7", "Pos": "MID" },
        { "Item": "C8", "Pos": "TL" },
        { "Item": "D3", "Pos": "TL" },
        { "Item": "D6", "Pos": "BL" },
        { "Item": "D7", "Pos": "TR" },
        { "Item": "D9", "Pos": "TR" },
        { "Item": "E9", "Pos": "MID" },
        { "Item": "F2", "Pos": "TL" },
        { "Item": "F4", "Pos": "BL" },
        { "Item": "F6", "Pos": "MID" },
        { "Item": "F9", "Pos": "BL" }
    ]
};