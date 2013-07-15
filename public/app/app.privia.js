define([ 'jquery',
  'underscore',
  'backbone'], function($, _, Backbone) {


  console.log('Initialize App'); 
  
  // Provide a global location to place configuration settings and module
  // creation.
  var app = {
  // The root path to run the application.
   root: '/'
  };
  var compiledTemplate = _.template( $('#sidebarsMenuSection').html(), {'akses':arrAkses} );
  $('#sidebarsMenu').html(compiledTemplate);

if (!Array.prototype.reduce)
{
  Array.prototype.reduce = function(fun /*, initial*/)
  {
    var len = this.length;
    if (typeof fun != "function")
      throw new TypeError();

    // no value to return if no initial value and an empty array
    if (len == 0 && arguments.length == 1)
      throw new TypeError();

    var i = 0;
    if (arguments.length >= 2)
    {
      var rv = arguments[1];
    }
    else
    {
      do
      {
        if (i in this)
        {
          rv = this[i++];
          break;
        }

        // if array contains no values, no initial value to return
        if (++i >= len)
          throw new TypeError();
      }
      while (true);
    }

    for (; i < len; i++)
    {
      if (i in this)
        rv = fun.call(null, rv, this[i], i, this);
    }

    return rv;
  };
}

  Number.prototype.formatPrice = function() {
      var p = this.toFixed(2).split(".");
      return "Rp. " + p[0].split("").reverse().reduce(function(acc, num, i, orig) {
          return  num + (i && !(i % 3) ? "," : "") + acc;
      }, "") ;
     // return this+"".replace(/(\d)(?=(\d{3})+)/g, "$1,");
  };

  return _.extend(app,{});

});