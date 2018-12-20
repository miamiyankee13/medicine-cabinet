'use strict'
//Declare golbal STATE object
const STATE = {
    token: null,
    strains: null,
    userStrains: [{
        name: 'Your cabinet is currently empty'
    }]
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

//TODO set up API call after setting up user authentication & user creation - call after successful auth
function getUserStrains() {
    displayCabinet();
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

function displayCabinet() {
    const cabinet = STATE.userStrains.map((strain, index) => renderCabinet(strain, index));
    $('.js-cabinet').html(cabinet);
    $('.js-cabinet').prop('hidden', false);
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

function renderCabinet(strain, index) {
    const name = strain.name;
    return `<div class="cabinet-strain" data-index="${index}"><h2>${name}</h2></div>`;
}


//DOCUMENT READY FUNCTION

//TODO remove getAllStrains & call after succesful auth
function handleMedicineCabinet() {
    getAllStrains();
}


$(handleMedicineCabinet);