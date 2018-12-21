'use strict'
//Declare golbal STATE object
const STATE = {
    token: null,
    strains: null,
    userStrains: null,
    currentStrain: null,
}

//Make login area visible
$('.js-login').prop('hidden', false);

//API CALLS

function authenticateUser(userName, password) {
    const settings = {
        url: '/auth/login',
        data: {
            userName: userName,
            password: password
        },
        dataType: 'json',
        type: 'POST'
    }

    $.ajax(settings).then(results => {
        STATE.token = results.authToken
        $('.js-login').prop('hidden', true);
        $('.js-message').prop('hidden', true);
        $('.js-nav').prop('hidden', false);
        getAllStrains();
        getUserStrains();
    }).catch(displayError);

    console.log(STATE);
}

function createUser(userName, password, firstName, lastName) {
    const settings = {
        url: '/users',
        data: JSON.stringify({
            userName: userName,
            password: password,
            firstName: firstName,
            lastName: lastName
        }),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST'
    }

    $.ajax(settings).then(() => {
        $('.js-message').text('Account created successfully!');
        $('.js-message').prop('hidden', false);
    });
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
    }).catch(displayError);
    
    console.log(STATE);
}

function addStrainToCabinet(id) {
    const settings = {
        url: `/users/strains/${id}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'PUT'
    }

    $.ajax(settings).then(() => {
        getUserStrains();
    }).catch(displayError);
}

function removeStrainFromCabinet(id) {
    const settings = {
        url: `/users/strains/${id}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'DELETE'
    }

    $.ajax(settings).then(() => {
        getUserStrains();
    }).catch(displayError);
}

function addCommentToStrain(id, content) {
    const settings = {
        url:`/strains/${id}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        data: JSON.stringify({
            comment: {
                content: content
            }
        }),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST'
    }

    $.ajax(settings).then(() => {
        getSingleUserStrain();
    }).catch(displayError);

    console.log(STATE);
}

function removeCommentFromStrain(id, commentId) {
    const settings = {
        url: `/strains/${id}/${commentId}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'DELETE'
    }

    $.ajax(settings).then(() => {
        getSingleUserStrain();
    }).catch(displayError)

    console.log(STATE);
}

//Get updated userStrains, update current strain, & display single strain
function getSingleUserStrain() {
    const settings = {
        url: '/users/strains',
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'GET'
    }
    
    $.ajax(settings).then(results => {
        STATE.userStrains = results.strains;
        const singleStrain = STATE.userStrains.find((element) => {
            return element.name === STATE.currentStrain.name;
        });
        STATE.currentStrain = singleStrain
        displaySingleStrain(STATE.currentStrain);
    }).catch(displayError);
}


//DISPLAY FUNCTIONS

function displayStrainDropDown() {
    const strainOptions = STATE.strains.map((strain, index) => renderStrainOptions(strain, index)).join('');
    const strainDropDownHtml = `
        <form>
            <label for="strain-select">Select a Strain:</label>
            <select id="strain-select">
            ${strainOptions}
            </select>
            <button class="js-add-btn btn" type="submit">Add to Cabinet</button>
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

function displaySingleStrain(strain) {
    const singleStrain = renderSingleStrain(strain);
    $('.js-single-strain').html(singleStrain);
    $('.js-cabinet-form').prop('hidden', true);
    $('.js-cabinet').prop('hidden', true);
    $('.js-single-strain').prop('hidden', false);
}

function displayError() {
    $('.js-message').text('There was an error loading the requested data');
    $('.js-message').prop('hidden', false);
}

//RENDERING FUNCTIONS

function renderStrainOptions(strain, index) {
    const name = strain.name;
    return `<option value="${index}">${name}</option>`;
}

function renderCabinet(strain, index) {
    const name = strain.name;
    return `<div class="cabinet-strain">
                <h2>${name}</h2>
                <button class="js-details-btn btn" data-index="${index}">Strain Details</button>
                <button class="js-remove-btn btn" data-index="${index}">Remove</button>
            </div>`;
}

function renderSingleStrain(strain) {
    const name = strain.name;
    const type = strain.type;
    const flavor = strain.flavor;
    const description = strain.description;
    const comments = strain.comments.map((comment, index) => {
        const content = comment.content;
        return `
        <p><em>${content}</em></p>
        <button class="js-remove-comment-btn btn" data-index="${index}">Remove</button>`
    }).join('');

    return `<div class="single-strain">
                <h2>${name}</h2>
                <h3>${type}</h3>
                <h4>Flavor</h4>
                <p>${flavor}</p>
                <h4>Description</h4>
                <p>${description}</p>
                <div>
                    <h3>Community Comments</h3>
                    ${comments}
                </div>
                <label for="add-comment">Add a comment:</label>
                <textarea id="add-comment" name="add-comment" rows="4" cols="50"></textarea>
                <button class="js-add-comment-btn btn">Add Comment</button>
            </div>`;
}

//EVENT LISTENERS

function submitUserLogin() {
    $('.js-login-btn').on('click', function(event) {
        event.preventDefault();
        const userName = $('#username').val();
        const password = $('#password').val();
        authenticateUser(userName, password);
    });
}

function submitUserRegister() {
    $('.js-register-btn').on('click', function(event) {
        event.preventDefault();
        $('.js-login').prop('hidden', true);
        $('.js-register').prop('hidden', false);
    });
}

function submitCreateUser() {
    $('.js-create-btn').on('click', function(event) {
        event.preventDefault();
        const userName = $('#username-create').val();
        const password = $('#password-create').val();
        const firstName = $('#firstname-create').val();
        const lastName = $('#lastname-create').val();
        createUser(userName, password, firstName, lastName);
    });
}

function submitBackToLogin() {
    $('.js-login-return-btn').on('click', function(event) {
        event.preventDefault(); 
        $('.js-message').prop('hidden', true);
        $('.js-register').prop('hidden', true);
        $('.js-login').prop('hidden', false);
    });
}

function submitAddToCabinet() {
    $('body').on('click', '.js-add-btn', function(event) {
        event.preventDefault();
        const index = $('#strain-select').val();
        const id = STATE.strains[index]._id;
        addStrainToCabinet(id);
    });
}

function submitRemoveFromCabinet() {
    $('body').on('click', '.js-remove-btn', function(event) {
        event.preventDefault();
        const index = $(event.target).attr('data-index');
        const id = STATE.userStrains[index]._id;
        removeStrainFromCabinet(id);
    });
}

function submitStrainDetails() {
    $('body').on('click', '.js-details-btn', function(event) {
        event.preventDefault();
        const index = $(event.target).attr('data-index');
        const strain = STATE.userStrains[index];
        STATE.currentStrain = strain;
        displaySingleStrain(strain);
        console.log(STATE);
    });
}

function submitUserComment() {
    $('body').on('click', '.js-add-comment-btn', function(event) {
        event.preventDefault();
        const id = STATE.currentStrain._id;
        const content = $('#add-comment').val();
        addCommentToStrain(id, content);
    });
}

function submitRemoveComment() {
    $('body').on('click', '.js-remove-comment-btn', function(event) {
        event.preventDefault();
        const id = STATE.currentStrain._id;
        const index = $(event.target).attr('data-index');
        const commentId = STATE.currentStrain.comments[index]._id;
        removeCommentFromStrain(id, commentId);
    });
}

function submitMyCabinet() {
    $('.js-my-cabinet').on('click', function(event) {
        event.preventDefault();
        $('.js-single-strain').prop('hidden', true);
        $('.js-cabinet-form').prop('hidden', false);
        $('.js-cabinet').prop('hidden', false);
    });
}

//DOCUMENT READY FUNCTION

function handleMedicineCabinet() {
    submitUserLogin();
    submitUserRegister();
    submitCreateUser();
    submitBackToLogin();
    submitAddToCabinet();
    submitRemoveFromCabinet();
    submitStrainDetails();
    submitUserComment();
    submitRemoveComment();
    submitMyCabinet();
}


$(handleMedicineCabinet);