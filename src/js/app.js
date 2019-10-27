App = {
  web3Provider: null,
  contracts: {},

  init: async function() {
    // Load pets.
    $.getJSON('../pets.json', function(data) {
      var petsRow = $('#petsRow');
      var petTemplate = $('#petTemplate');

      for (i = 0; i < data.length; i ++) {
        petTemplate.find('.panel-title').text(data[i].name);
        petTemplate.find('img').attr('src', data[i].picture);
        petTemplate.find('.pet-breed').text(data[i].breed);
        petTemplate.find('.pet-age').text(data[i].age);
        petTemplate.find('.pet-location').text(data[i].location);
        petTemplate.find('.btn-adopt').attr('data-id', data[i].id);
        petTemplate.find('.clink').attr('href', '../charityfiles/'+data[i].link);

        petsRow.append(petTemplate.html());
      }
    });

    return await App.initWeb3();
  },

  initWeb3: async function() {
    // Modern dapp browsers...
if (window.ethereum) {
  App.web3Provider = window.ethereum;
  try {
    // Request account access
    await window.ethereum.enable();
  } catch (error) {
    // User denied account access...
    console.error("User denied account access")
  }
}
// Legacy dapp browsers...
else if (window.web3) {
  App.web3Provider = window.web3.currentProvider;
}
// If no injected web3 instance is detected, fall back to Ganache
else {
  App.web3Provider = new Web3.providers.HttpProvider('http://localhost:7545');
}
web3 = new Web3(App.web3Provider);

    return App.initContract();
  },

  initContract: function() {
    $.getJSON('Adoption.json', function(data) {
  // Get the necessary contract artifact file and instantiate it with truffle-contract
  var AdoptionArtifact = data;
  App.contracts.Adoption = TruffleContract(AdoptionArtifact);

  // Set the provider for our contract
  App.contracts.Adoption.setProvider(App.web3Provider);

  // Use our contract to retrieve and mark the adopted pets
  return App.markAdopted();
});

    return App.bindEvents();
  },

  bindEvents: function() {
    $(document).on('click', '.btn-adopt', App.handleAdopt);
  },

  markAdopted: function(adopters, account) {
    var adoptionInstance;

App.contracts.Adoption.deployed().then(function(instance) {
  adoptionInstance = instance;

  return adoptionInstance.getAdopters.call();
}).then(function(adopters) {
  for (i = 0; i < adopters.length; i++) {
    if (adopters[i] !== '0x0000000000000000000000000000000000000000') {
      var back;
      counter[i] = parseInt(readCookie('count'+i));
      amraised[i] = parseInt(readCookie('raise'+i));
      back = readCookie('backs'+i);
      if(!counter[i]) counter[i] = 0;
      if(!amraised[i]) amraised[i] = 0;
      if(!back) back = "";
      var ua = $('.panel-pet').eq(i).find('.useramount').val();
      var ub = parseInt(ua,10);
      amraised[i] = ub + amraised[i];
      if(ua){
        counter[i]++;
        back = back+"\n"+adopters[i];
        $('.panel-pet').eq(i).find('.backers').text(back);
        $('.panel-pet').eq(i).find('.num-backers').text(counter[i]);
        $('.panel-pet').eq(i).find('.raised').text(amraised[i]);
      }
      $('.panel-pet').eq(i).find('.useramount').val('');
      eraseCookie('count'+i);
      eraseCookie('raise'+i);
      eraseCookie('backs'+i);
      createCookie('count'+i,counter[i],10);
      createCookie('raise'+i,amraised[i],10);
      createCookie('backs'+i,back,10);
      //$('.panel-pet').eq(i).find('button').text('Success').attr('disabled', true);
    }
  }
}).catch(function(err) {
  console.log(err.message);
});
  },

  handleAdopt: function(event) {
    event.preventDefault();

    var petId = parseInt($(event.target).data('id'));

    var adoptionInstance;

web3.eth.getAccounts(function(error, accounts) {
  if (error) {
    console.log(error);
  }

  var account = accounts[0];

  App.contracts.Adoption.deployed().then(function(instance) {
    adoptionInstance = instance;

    // Execute adopt as a transaction by sending account
    return adoptionInstance.adopt(petId, {from: account});
  }).then(function(result) {
    return App.markAdopted();
  }).catch(function(err) {
    console.log(err.message);
  });
});
  }

};
var counter = [];
var amraised = [];
$(function() {
  $(window).load(function() {
    App.init();
  });
});

function addnew(){
  var name = $('.name').text;
  var purpose = $('.breed').text;
  var amount = $('.age').text;
  var location = $('.location').text;
  const fs = require('fs')
  fs.readFile('../pets.json', 'utf-8', (err, data) => {
    if (err) throw err;

    // Converting Raw Buffer to text
    // data using tostring function.
    console.log(data);
  })
  $('.location').text(fs);

}

function createCookie(name,value,days) {
	if (days) {
		var date = new Date();
		date.setTime(date.getTime()+(days*24*60*60*1000));
		var expires = "; expires="+date.toGMTString();
	}
	else var expires = "";
	document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i=0;i < ca.length;i++) {
		var c = ca[i];
		while (c.charAt(0)==' ') c = c.substring(1,c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
	}
	return null;
}

function eraseCookie(name) {
	createCookie(name,"",-1);
}
