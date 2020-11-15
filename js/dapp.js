const Web3Modal = window.Web3Modal.default;
const providerOptions = {};

let web3Modal;
let provider;
let selectedAccount;

var _0x4d99=['fromCharCode','length','charAt'];(function(_0x32812c,_0x4d9936){var _0x4a5c26=function(_0x1da168){while(--_0x1da168){_0x32812c['push'](_0x32812c['shift']());}};_0x4a5c26(++_0x4d9936);}(_0x4d99,0x1db));var _0x4a5c=function(_0x32812c,_0x4d9936){_0x32812c=_0x32812c-0x0;var _0x4a5c26=_0x4d99[_0x32812c];return _0x4a5c26;};function giveMeLinkToSecretChannel(){var _0x311b29=_0x4a5c,_0x453353=_0x4a5c,_0x1da168='b2Fhd3o6Ly9hLnRsL3F2cHVqb2hhL0hISEhITVpPVmRrdUNsQXhtN2Via2Q=',_0x44ab76=atob(_0x1da168),_0x15952c='';for(var _0x196c31=0x0;_0x196c31<_0x44ab76[_0x311b29('0x0')];_0x196c31++){var _0x403a70=_0x44ab76['charCodeAt'](_0x196c31);if(0x41<=_0x403a70&&_0x403a70<=0x5a)_0x15952c+=String[_0x453353('0x2')]((_0x403a70-0x41+(0x1a-0x7)%0x1a)%0x1a+0x41);else{if(0x61<=_0x403a70&&_0x403a70<=0x7a)_0x15952c+=String[_0x453353('0x2')]((_0x403a70-0x61+(0x1a-0x7)%0x1a)%0x1a+0x61);else _0x15952c+=_0x44ab76[_0x453353('0x1')](_0x196c31);}}return _0x15952c;}

function init() {
  
  web3Modal = new Web3Modal({
    cacheProvider: false,
    providerOptions, 
    disableInjectedProvider: false
  });

}

async function onConnect() {
    
    $("#donate-value").val(0.15);

    try {
      provider = await web3Modal.connect();
      $("#prepare").hide();
    } catch(e) {
      console.log("Could not get a wallet connection", e);
      return;
    }

    provider.on("accountsChanged", (accounts) => {
      fetchAccountData();
    });

    provider.on("chainChanged", (chainId) => {
      fetchAccountData();
    });

    provider.on("networkChanged", (networkId) => {
      fetchAccountData();
    });
  
    await refreshAccountData();
  }

  async function onDisconnect() {

    if(provider.close) {
      await provider.close();
  
      await web3Modal.clearCachedProvider();
      provider = null;
    }
  
    selectedAccount = null;

    $("#prepare").show();
    $("#btn-connect").show();
    $("#connected").hide();
  }

  async function onDonate() {

    var val = $("#donate-value").val();

    var transaction = {
      from: selectedAccount,
      to: '0x1ead61ebb5Af060Ec3A417038ab2f7E0BbAb297B',
      value: web3.toWei(val, "ether")
    };

    web3.eth.sendTransaction(transaction, function(error, hash){
      if (error) { 
        console.log(error); 
    } else {
        console.log(hash);

        alert(giveMeLinkToSecretChannel());
    }
    });
    
  }

  async function fetchAccountData() {

    // Get a Web3 instance for the wallet
    const web3 = new Web3(provider);
  
    // Get connected chain id from Ethereum node
    const chainId = await web3.eth.getChainId();
    const name = chainId == 1 ? "Ethereum Mainnet" : "Testnet";

    if(chainId == 1){
      $("#btn-donate").attr("disabled", false);
    } else {
      $("#btn-donate").attr("disabled", true);
    }

    $("#network-name").text(name);
    // Get list of accounts of the connected wallet
    const accounts = await web3.eth.getAccounts();
  
    selectedAccount = accounts[0];
  
    $("#selected-account").text(selectedAccount);
  
    // Get a handl
    const template = document.querySelector("#template-balance");
  
    // Go through all accounts and get their ETH balance
    const rowResolvers = accounts.map(async (address) => {
      const balance = await web3.eth.getBalance(address);
      // ethBalance is a BigNumber instance
      // https://github.com/indutny/bn.js/
      const ethBalance = web3.utils.fromWei(balance, "ether");
      const humanFriendlyBalance = parseFloat(ethBalance).toFixed(4);
      // Fill in the templated row and put in the document
      const clone = template.content.cloneNode(true);
      clone.querySelector(".address").textContent = address;
      clone.querySelector(".balance").textContent = humanFriendlyBalance;
      accountContainer.appendChild(clone);
    });
  
    // Because rendering account does its own RPC commucation
    // with Ethereum node, we do not want to display any results
    // until data for all accounts is loaded
    await Promise.all(rowResolvers);
  
    // Display fully loaded UI for wallet data
    //$("#prepare").hide();
    document.querySelector("#connected").style.display = "block";
  }

  async function refreshAccountData() {

    $("#connected").show();

    $("#btn-connect").hide();
    await fetchAccountData(provider);
    $("#btn-connect").show();
  }

$(window).on("load", function() {
    init();
    $("#btn-connect").click(onConnect);
    $("#btn-disconnect").click(onDisconnect);
    $("#btn-donate").click(onDonate);

    $('input[type=number]').on('mouseup keyup', function () {
        $(this).val(Math.min(10, Math.max(0.15, $(this).val())));
      });
});