define([
  'jquery',
  'underscore',
  'backbone',
  './views/commonView',
  './views/analisaView',
  './views/userView',
  './views/karyawanView',
  './views/cabangView',
  './views/leasingView',
  './views/quoteView',
  './views/customerView',
  './views/perusahaanKreditView',
  './views/modalView'
  ], 

  function($, _, Backbone, CommonView, AnalisaView, UserView, KaryawanView,CabangView,LeasingView,QuoteView,CustomerView,
    PerusahaanKreditView,ModalView) {

    var AppRouter = Backbone.Router.extend({
      initialize : function(option) {
        this.currentView = {};
      },
      routes: {
      // Define some URL routes
      '/projects': 'showProjects',
      'users': 'showUsers',
      'users/add': 'addUsers',
      'users/edit/:id': 'editUsers',
      'karyawan/add': 'addKaryawan',
      'karyawan/edit/:id': 'editKaryawan',
      'karyawan': 'showKaryawan',
      'leasing/add': 'addLeasing',
      'leasing': 'showLeasing',
      'quote/add': 'addQuote',
      'quote/edit/:id': 'editQuote',
      'quote': 'showQuote',
      'customer/add': 'addCustomer',
      'customer/edit/:id': 'editCustomer',
      'customer': 'showCustomer',
      'perusahaanKredit/add': 'addPerusahaanKredit',
      'perusahaanKredit/edit/:id': 'editPerusahaanKredit',
      'perusahaanKredit': 'showPerusahaanKredit',
      'cabang/add': 'addCabang',
      'cabang/edit/:id': 'editCabang',
      'cabang': 'showCabang',
      'modal/customer': 'addCustomerModal',
      'home': 'showHome',
      'analisis': 'showAnalisa',
      'login': 'showLogin',
      'success': 'showSuccess',
      // Default
      '': 'defaultAction',
      '*actions': 'defaultAction'
    },
    defaultAction: function(action) {
      console.log('nodonk' + action);
      new CommonView().render();
    },
    showHome: function() {
      console.log('showHome');
      new CommonView().render();
    },
    showAnalisa: function() {
      console.log('showAnalisa');
      new AnalisaView().render();
    },
    showUsers: function() {

      new UserView().render();
    },
    addUsers: function() {
      console.log('addUsers');

      new UserView().render('form');
    },
    editUsers: function(id) {

     new UserView({id:id}).render('form');
   },
   addKaryawan: function() {
    console.log('addKaryawan');
    new KaryawanView().render('form');
  },
  editKaryawan: function(id) {

    new KaryawanView({id:id}).render('form');
  },
  showKaryawan: function() {
    console.log('showUsers');
    new KaryawanView().render();
  },
  addLeasing: function() {
    console.log('addLeasing');
    new LeasingView().render('form');
  },
  showLeasing: function() {
    console.log('showLeasing');
    new LeasingView().render();
  },
  addQuote: function() {
    console.log('addQuote');
    new QuoteView().render('form');
  },
  showQuote: function() {
    console.log('showQuote');
    new QuoteView().render();
  },
  editQuote: function(id) {

   new QuoteView({id:id}).render('form');
 },
 addCustomer: function() {
  console.log('addCustomer');
  new CustomerView().render('form');
},
showCustomer: function() {
  console.log('showCustomer');
  new CustomerView().render();
},
editCustomer: function(id) {

  new CustomerView({id:id}).render('form');
},
 addPerusahaanKredit: function() {
  console.log('addPerusahaanKredit');
  new PerusahaanKreditView().render('form');
},
showPerusahaanKredit: function() {
  console.log('showPerusahaanKredit');
  new PerusahaanKreditView().render();
},
editPerusahaanKredit: function(id) {
  new PerusahaanKreditView({id:id}).render('form');
},
addCabang: function() {
  console.log('addCabang');
  new CabangView().render('form');
},
showCabang: function() {
  console.log('showCabang');
  new CabangView().render()
},
editCabang: function(id) {
  new CabangView({id:id}).render('form');
},
addCustomerModal: function() {
  console.log('addCustomerModal');
  new ModalView().render('customer');
},
showSuccess: function() {
  new SuccessView().render()
},
showLogin: function() {
  console.log('showLogin');
  new LoginView().render()
},
showNganterinOffer: function() {
  console.log('showNganterinOffer');
  new NganterinOfferView().render();
},
showNganterinSearch: function() {
  console.log('showNganterinSearch');
  new NganterinSearchView().render();
},
showRegistration: function() {
 new RegistrationView().render()
}
});

return AppRouter;
});