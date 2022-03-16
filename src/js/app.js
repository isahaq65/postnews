App = {
  web3Provider: null,
  contracts: {},

  initWeb3: async function () {
    if (window.ethereum) {
      App.web3Provider = window.ethereum;
      if (window.ethereum) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          setAccounts(accounts);
        } catch (error) {
          if (error.code === 4001) {
            // User rejected request
            console.log("badhan magi");
          }

          // setError(error);
        }
      }
    } else if (window.web3) {
      App.web3Provider = window.web3.currentProvider;
    }

    // If no injected web3 instance is detected, fall back to Ganache
    else {
      App.web3Provider = new Web3.providers.HttpProvider(
        "http://localhost:8102"
      );
    }

    web3 = new Web3(App.web3Provider);
    web3.eth.defaultAccount = web3.eth.accounts[0];

    return App.initContract();
  },

  initContract: function () {
    $.getJSON("news.json", function (data) {
      // Get the necessary contract artifact file and instantiate it with truffle-contract
      App.contracts.news = TruffleContract(data);

      // Set the provider for our contract
      App.contracts.news.setProvider(App.web3Provider);

      // Use our contract to retrieve and mark the adopted pets
      // return App.markAdopted();
      return App.init();
    });

    // return App.bindEvents();
    return App.AddNewsButton();
  },

  init: async function () {
    // Load Products.
    var postInstance;
    web3.eth.defaultAccount = web3.eth.accounts[0];

    App.contracts.news
      .deployed()
      .then(function (instance) {
        postInstance = instance;
        return postInstance.newsCount();
      })
      .then(function (result) {
        var counts = result.c[0];
        console.log("Total News : " + counts);

        for (var i = 1; i <= counts; i++) {
          postInstance.newsfeeds(i).then(function (result) {
            console.log("Publisher Address:" + result[0]);
            console.log("News:" + result[1]);

            var newsRow = $("#newsRow");
            var postTemplate = $("#postTemplate");

            postTemplate.find(".panel-title").text(result[0]);
            postTemplate.find(".desc").text(result[1]);
            newsRow.append(postTemplate.html());
          });
        }
      });
  },

  AddNewsButton: function () {
    console.log("click button");
    $(document).on("click", ".addNews", App.AddNews);
  },

  AddNews: function (event) {
    var post = document.getElementById("post").value;
    var postInstance;
    web3.eth.defaultAccount = web3.eth.accounts[0];
    App.contracts.news.deployed().then(function (instance) {
      postInstance = instance;
      console.log("shakil madarchod");
      return postInstance.addnews(post);
      console.log("2 madarchod");
    });
    console.log("News posted");
  },
};

$(function () {
  $(window).load(function () {
    App.initWeb3();
  });
});
