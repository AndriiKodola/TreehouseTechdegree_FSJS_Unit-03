

/*---------------------------------------------------------------*/
/*---------focus on name field right afted DOM loaded------------*/
/*---------------------------------------------------------------*/

$(document).ready(function() {
  $('#name').focus();
});

/*---------------------------------------------------------------*/
/*--------------------”Job Role” section tasks-------------------*/
/*---------------------------------------------------------------*/

$('#other-title').hide();//hide custom role title in the DOM
//show custom role title in the DOM if "other" option choosen, or hide it opposite
$('#title').on('change', function() {
  if ($('#title option:selected').val() === 'other') {
    $('#other-title').show().focus();
  } else if ($('#title option:selected').val() !== 'other' || $('#other-title')) {
    $('#other-title').hide();
  }
});


/*---------------------------------------------------------------*/
/*----------------”T-Shirt Info” section tasks-------------------*/
/*---------------------------------------------------------------*/

const $jsPuntsColors = $("#color option:contains('JS Puns shirt only')"),
      $jsColors = $("#color option:contains('JS shirt only')"),
      $tShirtsColors = $('#colors-js-puns');//Exceeds: variable for exceeds

//Exceeds: colors hidden at the beginning
$tShirtsColors.hide();

//Filtering colors according to chosen design
$('#design').on('change', function() {
  if ($('#design option:selected').val() === 'js puns') {
    $tShirtsColors.show(500);//Exceeds: colors shown if design chosen
    $jsPuntsColors.show().prop('selected',true);
    $jsColors.hide();
  } else if ($('#design option:selected').val() === 'heart js') {
    $tShirtsColors.show(500);//Exceeds: colors shown if design chosen
    $jsColors.show().prop('selected',true);
    $jsPuntsColors.hide();
    $('#color').trigger("change");
  } else {
    $tShirtsColors.hide(500);//Exceeds: colors hidden if "select color" chosen
    $jsColors.show();
    $jsPuntsColors.show();
    $('#color').trigger("change");
  }
});

/*---------------------------------------------------------------*/
/*-----------”Register for Activities” section tasks-------------*/
/*---------------------------------------------------------------*/

//Excluding same time events
const $eventsListHTML = $('fieldset.activities label');
      eventsList = [];

//creates an array of event objects
for (let i = 0; i<$eventsListHTML.length; i++) {
    const currentEventHTML = $eventsListHTML[i],
          nameAttrHTML = currentEventHTML.getElementsByTagName('input')[0].getAttribute("name"),
          eventItemInnerText = currentEventHTML.innerText,
          regex = /\s(.+) — \$(\d+)|(.+) — (.+), \$(\d+)/;//$1, $3 - event names; $2, $5 - event prices; $4 - event dates
    let eventItem = {},
        eventName = "",
        eventDate = "",
        eventPrice = 0;
    if (eventItemInnerText.replace(regex, '$3') === "") {//if doesn't contain date in description
      eventName = eventItemInnerText.replace(regex, '$1');
      eventPrice = parseInt(eventItemInnerText.replace(regex, '$2'), 10);
    } else {
      eventName = eventItemInnerText.replace(regex, '$3');
      eventDate = eventItemInnerText.replace(regex, '$4');
      eventPrice = parseInt(eventItemInnerText.replace(regex, '$5'), 10);
    }

    eventItem = {name: eventName, dateString: eventDate, price: eventPrice, HTMLnameAttr: nameAttrHTML};
    eventsList.push(eventItem);
}

//appending total price tag
const $priceTotalHTML = $('<div>');
$('.activities').append($priceTotalHTML);
$priceTotalHTML.text(`Total: \$0`);

$('.activities').on('change', function(e) {
  const target = e.target;

  if (target.getAttribute("type") === "checkbox") {
    const targetName = target.getAttribute("name"),
          eventListItem = eventsList.find(eve => eve.HTMLnameAttr === targetName);//assigns an object from the eventList array according to it's HTML name attribute
    let priceTotal = 0;

    for (let i = 0; i<eventsList.length; i++) {
      const $eventItemCheckbox = $eventsListHTML[i].children[0],
            disabled = $eventItemCheckbox.getAttribute("disabled"),
            hasSameDate = eventsList[i].dateString === eventListItem.dateString,
            notSameItem = eventsList[i].HTMLnameAttr !== eventListItem.HTMLnameAttr,
            isChecked = $eventItemCheckbox.checked === true;

      //disabling items with same date
      if (disabled && hasSameDate) {//enables if was disabled
          $eventItemCheckbox.removeAttribute("disabled");
      } else if (notSameItem && hasSameDate) {
          $eventItemCheckbox.setAttribute("disabled", true);
      }

      //calculates total price
      if (isChecked) {
        priceTotal += eventsList[i].price;
      }
    }

    //shows total price
    $priceTotalHTML.text(`Total: \$${priceTotal}`);
  }
});

/*---------------------------------------------------------------*/
/*-----------------"Payment Info" section tasks------------------*/
/*---------------------------------------------------------------*/

const paymentSelection = document.getElementById('payment'),
      $cardDiv = $('#credit-card'),
      $payPalDiv = $cardDiv.next(),
      $bitCoinDiv = $payPalDiv.next();

//chooses credit card option by default, and hides select method option, payPal, and bitcoin divs.
$('#payment').val('credit card');
$('#payment option[value="select_method"]').hide();
$cardDiv.show();
$payPalDiv.hide();
$bitCoinDiv.hide();

//hides payment option divs according to the chosen option
paymentSelection.addEventListener('change', function() {
  if ($('#payment option:selected').val() === 'credit card') {
    $cardDiv.show();
    $payPalDiv.hide();
    $bitCoinDiv.hide();
  } else if ($('#payment option:selected').val() === 'paypal') {
    $cardDiv.hide();
    $payPalDiv.show();
    $bitCoinDiv.hide();
  } else if ($('#payment option:selected').val() === 'bitcoin') {
    $cardDiv.hide();
    $payPalDiv.hide();
    $bitCoinDiv.show();
  }
});

/*---------------------------------------------------------------*/
/*---------------------Form validation tasks---------------------*/
/*---------------------------------------------------------------*/

const $basicInfo = $('fieldset')[0],
      $labelName = $('label[for=name]'),
      $labelMail =  $('label[for=mail]'),
      $legendActivities = $('fieldset.activities legend'),
      $divCreditCard = $('#credit-card');

//creates an error <span> tag with given text inside
const createInvalidInputMessageNode = (messageText) => {
  const  $invalidInputMessage = $('<span>');
  $invalidInputMessage.text(`${messageText}`);
  $invalidInputMessage
    .css('display', 'inline-block')
    .css('font-size', '1rem')
    .css('font-weight', 'normal')
    .css('color', '#228B22')
    .css('padding', '0 .5em')
    .css('margin', '0 .5em')
    .css('border', '1px solid #228B22')
    .css('border-radius', '10px')
    .css('color', '#228B22');

  return $invalidInputMessage;
};

//Exceeds: Tip node creator.
const createInputTipMessageNode = (messageText) => {
  const  $InputTipMessage = $('<span>');
  $InputTipMessage.text(`${messageText}`);
  $InputTipMessage
    .css('display', 'inline-block')
    .css('background', '#F0F8FF')
    .css('font-size', '1rem')
    .css('font-weight', 'normal')
    .css('color', '#228B22')
    .css('padding', '0 .5em')
    .css('margin', '0 .5em')
    .css('border', '2px solid #228B22')
    .css('border-radius', '0 20px 20px 0')
    .css('color', '#228B22');
  $InputTipMessage.addClass('tip');

  return $InputTipMessage;
};

//creating error messages
const $invalidNameMessage = createInvalidInputMessageNode('User name can contain letters and numbers only.'),
      $invalidMailMessage = createInvalidInputMessageNode('Please, enter a valid email address.'),
      $noActivitiesChosen = createInvalidInputMessageNode('Please, choose your desired activity.'),
      $invalidCreditCard = createInvalidInputMessageNode('Please, provide valid credit card number, Zip, and CVV codes.');

//Exceeds: Tip node created.
const $tipCreditCardNum =  createInputTipMessageNode('Valid credit card number should have between 13 and 16 digits.');

//appends a child to the node with display style = 'none'
const appendHiddenNode = (parentNode, appendedChild) => {
  parentNode.append(appendedChild);
  appendedChild.hide();
};

//appending error messages to corresponding nodes
appendHiddenNode($labelName, $invalidNameMessage);
appendHiddenNode($labelMail, $invalidMailMessage);
appendHiddenNode($legendActivities, $noActivitiesChosen);
$divCreditCard.append('<br>');
appendHiddenNode($divCreditCard, $invalidCreditCard);

//Exceeds: Tip node attached to credit card number input.
appendHiddenNode($('.col-6'), $tipCreditCardNum);

//Exceeds: Showing hidden tip node if input field isn't blank and valid.
document.getElementById('cc-num').addEventListener('input', function(e) {
  const inputCCNum = e.target,
        inputCCNumValue = inputCCNum.value;

  let ccNumIsValid = /^\d{13,16}$/.test(inputCCNumValue);

  if (inputCCNumValue !== "" && !ccNumIsValid) {
    $tipCreditCardNum.show(250);
  } else {
    $tipCreditCardNum.hide(250);
  }
});

$('form').on('submit', function(e) {
  const inputName = document.getElementById('name'),
        inputNameValue = inputName.value,
        inputMail = document.getElementById('mail'),
        inputMailValue = inputMail.value,
        fieldsetActivities = document.querySelector('fieldset.activities'),
        checkboxListActivities = fieldsetActivities.querySelectorAll('option'),
        inputCCNum = document.getElementById('cc-num'),
        inputCCNumValue = inputCCNum.value,
        inputZip = document.getElementById('zip'),
        inputZipValue = inputZip.value,
        inputCVV = document.getElementById('cvv'),
        inputCVVValue = inputCVV.value;

//input validators
  let usernameIsValid = /^\w+$/.test(inputName),
      emailIsValid = /^[^@]+@[^@.]+\.[a-z]+$/.test(inputMail),
      ccNumIsValid = /^\d{13,16}$/.test(inputCCNumValue),
      zipIsValid = /^\d{5}$/.test(inputZipValue),
      cvvIsValid = /^\d{3}$/.test(inputCVVValue),
      activityIsChosen = false || checkboxListActivities.forEach(function(activity) { //returns true if one of elements in chosen or defined as false otherwise
        if (!activity.checked) { continue; }
        return true;
      });

//reseting error messages and input field styles during each submission
  $invalidNameMessage.hide(500);
  inputName.style.borderColor = '#c1deeb';
  $invalidMailMessage.hide(500);
  inputMail.style.borderColor = '#c1deeb';
  $noActivitiesChosen.hide(500);
  $invalidCreditCard.hide(500);
  inputCCNum.style.borderColor = '#c1deeb';
  inputZip.style.borderColor = '#c1deeb';
  inputCVV.style.borderColor = '#c1deeb';

//vaildating users input and showing necessary messages
  if (inputNameValue === "") {
    e.preventDefault();
    $invalidNameMessage.text('Please, enter your name.');
    $invalidNameMessage.show(500);
    inputName.style.borderColor = '#dc143c';
  } else if (!usernameIsValid) {//Exceeds: Checks for validity of user name in addition to if it's blank.
    e.preventDefault();
    $invalidNameMessage.text('User name can contain letters and numbers only.');
    $invalidNameMessage.show(500);
    inputName.style.borderColor = '#dc143c';
  }
  if (!emailIsValid) {
    e.preventDefault();
    $invalidMailMessage.show(500);
    inputMail.style.borderColor = '#dc143c';
  }
  if (!activityIsChosen) {
    e.preventDefault();
    $noActivitiesChosen.show(500);
  }

  if ($('#payment option:selected').val() === 'credit card') {//only if credit card option is selected
    if (!ccNumIsValid) {
      e.preventDefault();
      $invalidCreditCard.show(500);
      inputCCNum.style.borderColor = '#dc143c';
    }
    if (!zipIsValid) {
      e.preventDefault();
      $invalidCreditCard.show(500);
      inputZip.style.borderColor = '#dc143c';
    }
    if (!cvvIsValid) {
      e.preventDefault();
      $invalidCreditCard.show(500);
      inputCVV.style.borderColor = '#dc143c';
    }
  }
});
