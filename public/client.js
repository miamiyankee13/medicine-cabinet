'use strict'
//Declare golbal STATE object
const STATE = {
    token: null,
    strains: null,
    userStrains: null
}

//Make login area visible
$('.js-login').prop('hidden', false);

//API CALLS

function authenticateUser(userName, password) {
    const settings = {
        url: '/auth/login',
        data: {
            username: userName,
            password: password
        },
        dataType: 'json',
        type: 'POST'
    }

    $.ajax(settings).then(results => {
        STATE.token = results.authToken
        $('.js-login').prop('hidden', true);
        getAllStrains();
        getUserStrains();
    }).catch(displayError);

    console.log(STATE);
}

function getAllStrains() {
    const settings = {
        url: '/strains',
        dataType: 'json',
        type: 'GET'
    }

    $.ajax(settings).then(results => {
        STATE.strains = results.strains;
        displayStrainDropDown();
    }).catch(displayError);

    console.log(STATE);
}

function getUserStrains() {
    const settings = {
        url: '/users/strains',
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'GET'
    }
    
    $.ajax(settings).then(results => {
        STATE.userStrains = results.strains;
        displayCabinet();
    }).catch(displayEmptyCabinet);
    
    console.log(STATE);
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

function displayEmptyCabinet() {
    $('.js-message').text('Your cabinet is currently empty');
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

//EVENT LISTENERS

function submitUserLogin() {
    $('.js-login-btn').on('click', function(event) {
        event.preventDefault();
        const userName = $('#username').val();
        const password = $('#password').val();
        console.log(userName);
        console.log(password);
        authenticateUser(userName, password);
    });
}


//DOCUMENT READY FUNCTION

function handleMedicineCabinet() {
    submitUserLogin();
}


$(handleMedicineCabinet);