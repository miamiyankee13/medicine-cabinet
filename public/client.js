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

//POST userName & password for authorization/login
//-save JWT token to STATE
//-hide login & message
//-display nav bar, strain drop down, & user cabinet
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

//POST userName, password, firstName, & lastName to DB
//-display message
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
    }).catch(displayError);
}

//GET all existing strains from DB
//-save strains to STATE
//-display strain drop down
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

//GET user specific strains from DB
//-save user specific strains to STATE
//-display user "cabinet"
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

//PUT specific strain in user "cabinet" in DB
//-retreive & display updated data
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

//DELETE specific strain from user "cabinet" in DB
//-retreive & display updated data
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

//POST comment to strain in DB
//-retreive & display updated data
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
        getCurrentStrain();
    }).catch(displayError);

    console.log(STATE);
}

//DELETE comment from strain in DB
//-retreive & display updated data
function removeCommentFromStrain(id, commentId) {
    const settings = {
        url: `/strains/${id}/${commentId}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'DELETE'
    }

    $.ajax(settings).then(() => {
        getCurrentStrain();
    }).catch(displayError)

    console.log(STATE);
}

//GET current strain from DB
//-retreive user specific strains from DB
//-save user specific strains to STATE
//-update current strain in STATE using 'find' method
//-display current strain
function getCurrentStrain() {
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
        displayCurrentStrain(STATE.currentStrain);
    }).catch(displayError);
}

//POST strain name, type, flavor & description to DB
//-display message
function createNewStrain(name, type, flavor, description) {
    const settings = {
        url: '/strains',
        headers: {"Authorization": `Bearer ${STATE.token}`},
        data: JSON.stringify({
            name: name,
            type: type,
            description: description,
            flavor: flavor
        }),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST'
    }

    $.ajax(settings).then(() => {
        $('.js-message').text('Strain created successfully!');
        $('.js-message').prop('hidden', false);
    }).catch(displayError);
}


//DISPLAY FUNCTIONS


//Create & display strain drop down by passing each strain from STATE through rendering function
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

//Create & display user cabinet by passing each user strain from STATE through rendering function
function displayCabinet() {
    const cabinet = STATE.userStrains.map((strain, index) => renderCabinet(strain, index));
    $('.js-cabinet').html(cabinet);
    $('.js-cabinet').prop('hidden', false);
}

//Create & display current strain by passing current strain from STATE through rendering function
function displayCurrentStrain(strain) {
    const currentStrain = renderCurrentStrain(strain);
    $('.js-single-strain').html(currentStrain);
    $('.js-cabinet-form').prop('hidden', true);
    $('.js-cabinet').prop('hidden', true);
    $('.js-single-strain').prop('hidden', false);
}

//Create & display error message
function displayError() {
    $('.js-message').text('There was an error loading the requested data');
    $('.js-message').prop('hidden', false);
}

//RENDERING FUNCTIONS


//Create HTML for strain option using strain & index passed from display function
function renderStrainOptions(strain, index) {
    const name = strain.name;
    return `<option value="${index}">${name}</option>`;
}

//Create HTML for user cabinet using strain & index passed from display function
function renderCabinet(strain, index) {
    const name = strain.name;
    return `<div class="cabinet-strain">
                <h2>${name}</h2>
                <button class="js-details-btn btn" data-index="${index}">Strain Details</button>
                <button class="js-remove-btn btn" data-index="${index}">Remove</button>
            </div>`;
}

//Create HTML for current strain using strain passed from display function
function renderCurrentStrain(strain) {
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


//User login on click
function submitUserLogin() {
    $('.js-login-btn').on('click', function(event) {
        event.preventDefault();
        const userName = $('#username').val();
        const password = $('#password').val();
        authenticateUser(userName, password);
        $('#username').val('');
        $('#password').val('');
    });
}

//Render user registration area on click
function goToUserRegister() {
    $('.js-register-btn').on('click', function(event) {
        event.preventDefault();
        $('.js-login').prop('hidden', true);
        $('.js-register').prop('hidden', false);
    });
}

//User creation on click
function submitCreateUser() {
    $('.js-create-btn').on('click', function(event) {
        event.preventDefault();
        const userName = $('#username-create').val();
        const password = $('#password-create').val();
        const firstName = $('#firstname-create').val();
        const lastName = $('#lastname-create').val();
        createUser(userName, password, firstName, lastName);
        $('#username-create').val('');
        $('#password-create').val('');
        $('#firstname-create').val('');
        $('#lastname-create').val('');
    });
}

//Render login area on click
function goBackToLogin() {
    $('.js-login-return-btn').on('click', function(event) {
        event.preventDefault(); 
        $('.js-message').prop('hidden', true);
        $('.js-register').prop('hidden', true);
        $('.js-login').prop('hidden', false);
    });
}

//Add strain to cabinet on click
function submitAddToCabinet() {
    $('body').on('click', '.js-add-btn', function(event) {
        event.preventDefault();
        const index = $('#strain-select').val();
        const id = STATE.strains[index]._id;
        addStrainToCabinet(id);
    });
}

//Remove strain from cabinet on click
function submitRemoveFromCabinet() {
    $('body').on('click', '.js-remove-btn', function(event) {
        event.preventDefault();
        const index = $(event.target).attr('data-index');
        const id = STATE.userStrains[index]._id;
        removeStrainFromCabinet(id);
    });
}

//Render current strain details area on click
function goToStrainDetails() {
    $('body').on('click', '.js-details-btn', function(event) {
        event.preventDefault();
        const index = $(event.target).attr('data-index');
        const strain = STATE.userStrains[index];
        STATE.currentStrain = strain;
        displayCurrentStrain(strain);
        console.log(STATE);
    });
}

//Add comment to strain on click
function submitUserComment() {
    $('body').on('click', '.js-add-comment-btn', function(event) {
        event.preventDefault();
        const id = STATE.currentStrain._id;
        const content = $('#add-comment').val();
        addCommentToStrain(id, content);
    });
}

//Remove comment from strain on click
function submitRemoveComment() {
    $('body').on('click', '.js-remove-comment-btn', function(event) {
        event.preventDefault();
        const id = STATE.currentStrain._id;
        const index = $(event.target).attr('data-index');
        const commentId = STATE.currentStrain.comments[index]._id;
        removeCommentFromStrain(id, commentId);
    });
}

//Render cabinet area on click
function goToMyCabinet() {
    $('.js-my-cabinet').on('click', function(event) {
        event.preventDefault();
        $('.js-single-strain').prop('hidden', true);
        $('.js-create-strain').prop('hidden', true);
        $('.js-message').prop('hidden', true);
        getAllStrains();
        getUserStrains();
    });
}

//Render create strain area on click
function goToCreateStrainPage() {
    $('.js-create-strain-link').on('click', function(event) {
        event.preventDefault();
        $('.js-single-strain').prop('hidden', true);
        $('.js-cabinet-form').prop('hidden', true);
        $('.js-cabinet').prop('hidden', true);
        $('.js-create-strain').prop('hidden', false);
    });
}

//Add strain to DB on click
function submitCreateStrain() {
    $('.js-create-strain-btn').on('click', function(event) {
        event.preventDefault();
        const name = $('#strain-name-create').val();
        const type = $('#strain-type-create').val();
        const flavor = $('#strain-flavor-create').val();
        const description = $('#strain-description-create').val();
        createNewStrain(name, type, flavor, description);
        $('#strain-name-create').val('');
        $('#strain-type-create').val('');
        $('#strain-flavor-create').val('');
        $('#strain-description-create').val('');
    });
}

//Remove token & render login area on click
function userLogOut() {
    $('.js-logout').on('click', function(event) {
        event.preventDefault();
        STATE.token = null;
        $('.js-single-strain').prop('hidden', true);
        $('.js-cabinet-form').prop('hidden', true);
        $('.js-cabinet').prop('hidden', true);
        $('.js-create-strain').prop('hidden', true);
        $('.js-nav').prop('hidden', true);
        $('.js-login').prop('hidden', false);
        console.log(STATE);
    });
}


//DOCUMENT READY FUNCTION

function handleMedicineCabinet() {
    submitUserLogin();
    goToUserRegister();
    submitCreateUser();
    goBackToLogin();
    submitAddToCabinet();
    submitRemoveFromCabinet();
    goToStrainDetails();
    submitUserComment();
    submitRemoveComment();
    goToMyCabinet();
    goToCreateStrainPage();
    submitCreateStrain();
    userLogOut();
}

$(handleMedicineCabinet);