'use strict'
//Declare golbal STATE object
const STATE = {
    token: null,
    strains: null,
    currentUser: null,
    userStrains: null,
    currentStrain: null,
    interval: null
}

//Make login area visible
$('.js-login').prop('hidden', false);


//API CALLS

//GET all existing strains from DB
//-save strains to STATE (29)
//-display strain dropdown (30)
function getAllStrains() {
    const settings = {
        url: '/strains',
        dataType: 'json',
        type: 'GET'
    }

    $.ajax(settings).then(results => {
        STATE.strains = results.strains;
        displayStrainDropDown();
    }).catch(err => {
        displayError(err.responseJSON.message);
    });

    console.log(STATE);
}

//GET user specific strains from DB
//-save user specific strains to STATE (50)
//-display user cabinet (51)
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
    }).catch(err => {
        displayError(err.responseJSON.message);
    });
    
    console.log(STATE);
}

//POST userName & password for authorization/login
//-save JWT token to STATE (76)
//-save userName to STATE (77)
//-save token refresh interval to STATE (78)
//-hide login, register, & messages (80-82)
//-display nav bar (83)
//-retrieve & display strain dropdown (84)
//-retrieve & display user cabinet (85)
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
        STATE.token = results.authToken;
        STATE.currentUser = userName;
        STATE.interval = window.setInterval(refreshToken, 120 * 1000);
        $('.js-login').prop('hidden', true);
        $('.js-register').prop('hidden', true);
        $('.js-message').prop('hidden', true);
        $('.js-message-success').prop('hidden', true);
        $('.js-nav').prop('hidden', false);
        getAllStrains();
        getUserStrains();
    }).catch(err => {
        displayError(err.responseText);
    });

    console.log(STATE);
}

//POST userName, password, firstName, & lastName to DB
//-display successful creation message (113-114)
//-authenticate user (115)
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
        $('.js-message-success').text('Account created successfully!');
        $('.js-message-success').prop('hidden', false);
        authenticateUser(userName, password);
    }).catch(err => {
        displayError(err.responseJSON.message);
    });
}

//POST JWT token for refresh
//-save new token to STATE (132)
function refreshToken() {
    const settings = {
        url: '/auth/refresh',
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'POST'
    }

    $.ajax(settings).then((results) => {
        STATE.token = results.authToken;
    }).catch(err => {
        displayError(err.responseText);
    });

    console.log(STATE);
}

//PUT specific strain in user cabinet in DB
//-retrieve & display updated user cabinet (151)
function addStrainToCabinet(id) {
    const settings = {
        url: `/users/strains/${id}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'PUT'
    }

    $.ajax(settings).then(() => {
        getUserStrains();
    }).catch(err => {
        displayError(err.responseJSON.message);
    });
}

//DELETE specific strain from user "cabinet" in DB
//-retrieve & display updated user cabinet (168)
function removeStrainFromCabinet(id) {
    const settings = {
        url: `/users/strains/${id}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'DELETE'
    }

    $.ajax(settings).then(() => {
        getUserStrains();
    }).catch(err => {
        displayError(err.responseJSON.message);
    });
}

//GET current strain from DB
//-save user specific strains to STATE (187)
//-retrieve user specific current strain (188-191)
//-replace current strain in STATE with user specific current strain (192)
//-display updated current strain details from STATE
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
        displayCurrentStrainDetails(STATE.currentStrain);
    }).catch(err => {
        displayError(err.responseJSON.message);
    });
}

//POST comment to strain in DB
//-retrieve & display updated current strain details
function addCommentToStrain(id, content, author) {
    const settings = {
        url:`/strains/${id}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        data: JSON.stringify({
            comment: {
                content: content,
                author: author
            }
        }),
        contentType: 'application/json',
        dataType: 'json',
        type: 'POST'
    }

    $.ajax(settings).then(() => {
        getCurrentStrain();
    }).catch(err => {
        displayError(err.responseJSON.message);
    });

    console.log(STATE);
}

//DELETE comment from strain in DB
//-retreive & display updated current strain details
function removeCommentFromStrain(id, commentId) {
    const settings = {
        url: `/strains/${id}/${commentId}`,
        headers: {"Authorization": `Bearer ${STATE.token}`},
        dataType: 'json',
        type: 'DELETE'
    }

    $.ajax(settings).then(() => {
        getCurrentStrain();
    }).catch(err => {
        displayError(err.responseJSON.message);
    })

    console.log(STATE);
}

//POST strain name, type, flavor & description to DB
//-display successful creation message
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
        $('.js-message-success').text('Strain created successfully!');
        $('.js-message-success').prop('hidden', false);
    }).catch(err => {
        displayError(err.responseJSON.message);
    });
}


//DISPLAY FUNCTIONS


//Create & display strain drop down by passing each strain from STATE through rendering function
function displayStrainDropDown() {
    const strainOptions = STATE.strains.map((strain, index) => renderStrainOptions(strain, index)).join('');
    const strainDropDownHtml = `
        <form>
            <label for="strain-select">Select a Strain</label>
            <select id="strain-select">
            ${strainOptions}
            </select>
            <button class="js-add-btn btn" type="submit">Add Strain</button>
        </form>
    `;

    $('.js-cabinet-form').html(strainDropDownHtml);
    $('.js-cabinet-form').prop('hidden', false);
}

//Create & display user cabinet by passing each user strain from STATE through rendering function
function displayCabinet() {
    const cabinetStrains = STATE.userStrains.map((strain, index) => renderCabinet(strain, index)).join('');
    const cabinetHtml = `
        <h3>Strains in Cabinet: ${STATE.userStrains.length}</h3>
        <div class="flex-cabinet">
            ${cabinetStrains}
        </div>`;

    $('.js-cabinet').html(cabinetHtml);
    $('.js-cabinet').prop('hidden', false);
}

//Create & display current strain by passing current strain from STATE through rendering function
function displayCurrentStrainDetails(strain) {
    const currentStrain = renderCurrentStrain(strain);
    $('.js-single-strain').html(currentStrain);
    $('.js-cabinet-form').prop('hidden', true);
    $('.js-cabinet').prop('hidden', true);
    $('.js-single-strain').scrollTop(0);
    $('.js-single-strain').prop('hidden', false);
}

//Create & display error message
function displayError(message) {
    $('.js-message').text(message);
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
        const author = comment.author;
        let removeButton;
        
        if (STATE.currentUser === author) {
            removeButton = `<button class="js-remove-comment-btn btn" data-index="${index}">Remove</button>`
        } else {
            removeButton = '';
        }
        
        return `
        <br>
        <p class="comment-content"><em>${content}</em></p>
        <p><small>Posted by ${author}</small></p>
        ${removeButton}
        `
    }).join('');

    let typeHtml;

    if (type === 'Sativa' || type === 'sativa') {
        typeHtml = `<h3 class="sativa">Sativa</h3>`;
    } else if (type === 'Indica' || type ==='indica') {
        typeHtml = `<h3 class="indica">Indica</h3>`;
    } else {
        typeHtml = `<h3 class="hybrid">Hybrid</h3>`
    }
    
    return `<div class="flex-single-strain">
                <h2>${name}</h2>
                <br>
                ${typeHtml}
                <br>
                <h4 class="detail-heading">Flavor</h4>
                <br>
                <p>${flavor}</p>
                <br>
                <h4 class="detail-heading">Description</h4>
                <br>
                <p>${description}</p>
                <br>
                <div>
                    <h4 class="detail-heading">Community Comments</h4>
                    ${comments}
                </div>
                <br>
                <label for="add-comment">Add a comment</label>
                <textarea id="add-comment" name="add-comment" rows="4" cols="30"></textarea>
                <button class="js-add-comment-btn btn">Add Comment</button>
                <br>
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
        $('.js-message').prop('hidden', true);
        $('.js-register').prop('hidden', false);
    });
}

//User creation on click
function submitCreateUser() {
    $('.js-create-btn').on('click', function(event) {
        event.preventDefault();
        const userName = $('#username-create').val();
        const password = $('#password-create').val();
        const passwordCheck = $('#password-check').val();
        const firstName = $('#firstname-create').val();
        const lastName = $('#lastname-create').val();

        if (password !== passwordCheck) {
            $('.js-message').text('"Password" & "Verify Password" fields must match');
            $('.js-message').prop('hidden', false);
            return
        }

        createUser(userName, password, firstName, lastName);
        $('#username-create').val('');
        $('#password-create').val('');
        $('#password-check').val('');
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
        const strainExists = STATE.userStrains.find((element) => {
            return element._id === STATE.strains[index]._id;
        });
        
        if (strainExists) {
            $('.js-message').text('This strain is already in your cabinet');
            $('.js-message').prop('hidden', false);
            return
        }

        addStrainToCabinet(id);
        $('.js-message').prop('hidden', true);
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
        displayCurrentStrainDetails(strain);
        console.log(STATE);
        $('.js-message').prop('hidden', true);
    });
}

//Add comment to strain on click
function submitUserComment() {
    $('body').on('click', '.js-add-comment-btn', function(event) {
        event.preventDefault();
        const id = STATE.currentStrain._id;
        const content = $('#add-comment').val();
        const author = STATE.currentUser;

        if (content === '' || content === ' ') {
            $('.js-message').text('Comment is blank. Please add some content');
            $('.js-message').prop('hidden', false);
            return
        }

        addCommentToStrain(id, content, author);
        $('.js-message').prop('hidden', true);
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
        $('.js-message-success').prop('hidden', true);
        getAllStrains();
        getUserStrains();
    });
}

//Render top of cabinet area on click
function goBackToCabinetTop() {
    $('.js-back-to-top').on('click', function(event) {
        $('.js-create-strain').prop('hidden', true);
        $('.js-single-strain').prop('hidden', true);
        $('.js-cabinet').prop('hidden', true);
        $('.js-cabinet').scrollTop(0);
        $('.js-cabinet').prop('hidden', false);
    });
}

//Render create strain area on click
function goToCreateStrainPage() {
    $('.js-create-strain-link').on('click', function(event) {
        event.preventDefault();
        $('.js-single-strain').prop('hidden', true);
        $('.js-cabinet-form').prop('hidden', true);
        $('.js-cabinet').prop('hidden', true);
        $('.js-message').prop('hidden', true);
        $('.js-create-strain').scrollTop(0);
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

        if (type === 'sativa' || type === 'Sativa' || type === 'indica' || type === 'Indica' ||
            type === 'hybrid' || type === 'Hybrid') {
                createNewStrain(name, type, flavor, description);
                $('#strain-name-create').val('');
                $('#strain-type-create').val('');
                $('#strain-flavor-create').val('');
                $('#strain-description-create').val('');
            } else {
                $('.js-message').text('"Type" must be "Sativa", "Indica", or "Hybrid"' );
                $('.js-message').prop('hidden', false);
            }

        
    });
}

//Render login area on click
//-Remove token, currentUser, currentStrain, & userStrains
//-Clear & remove interval
function userLogOut() {
    $('.js-logout').on('click', function(event) {
        event.preventDefault();
        STATE.token = null;
        STATE.currentUser = null;
        STATE.currentStrain = null;
        STATE.userStrains = null;
        window.clearInterval(STATE.interval);
        STATE.interval = null;
        $('.js-message').prop('hidden', true);
        $('.js-message-success').prop('hidden', true);
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
    goBackToCabinetTop();
    goToCreateStrainPage();
    submitCreateStrain();
    userLogOut();
}

$(handleMedicineCabinet);