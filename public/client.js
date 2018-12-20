'use strict'
//Declare golbal STATE object
const STATE = {
    token: null,
    strains: null,
    userStrains: null
}

//API CALLS


function getAllStrains() {
    const settings = {
        url: '/strains',
        dataType: 'json',
        type: 'GET'
    }

    $.ajax(settings).then(results => {
        STATE.strains = results.strains;
        displayStrainDropDown();
        console.log(STATE);
    }).catch(displayError);
}


//DISPLAY FUNCTIONS

function displayStrainDropDown() {
    const strainOptions = STATE.strains.map((strain, index) => renderStrainOptions(strain, index));
    const strainDropDownHtml = `
        <form>
            <label for="strain-select">Select a Strain:</label>
            <select id="strain-select">
            ${strainOptions}
            </select>
            <button type="submit">Add to Cabinet</button>
        </form>
    `;

    $('.js-cabinet-form').html(strainDropDownHtml);
    $('.js-cabinet-form').prop('hidden', false);
}

function displayError() {
    $('.js-message').text('There was an error loading the requested data');
    $('.js-message').prop('hidden', false);
}

//RENDERING FUNCTIONS

function renderStrainOptions(strain, index) {
    const name = strain.name;
    return `<option value="${name}" data-index="${index}">${name}</option>`;
}




//DOCUMENT READY FUNCTION

function handleMedicineCabinet() {
    getAllStrains();
}


$(handleMedicineCabinet);