
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../config')[env]
  , Schema = mongoose.Schema

/**
 * Properti Schema
 */

var QuoteSchema = new Schema({
    customer: {type : Schema.Types.Mixed},
    kendaraanRoda: {type : String, default : '', trim : true},
    jenisKendaraan: {type : String, default : '', trim : true},
    namaKendaraan: {type : String, default : '', trim : true},
    tahunBuat: {type : String, default : '', trim : true},
    hargaOTR: {type : Number, default : 0},
    perusahaanKredit: {type : Schema.Types.Mixed},
    bungaAsuransi : {type : String, default : '', trim : true},
    bungaPinjaman : {type : String, default : '', trim : true},
    lamaPinjaman: {type : String, default : '', trim : true},
    sukuBunga: {type : Number, default : 0},
    asstTlo: {type : Number, default : 0},
    cashBack: {type : Number, default : 0},
    carDepreciation: {type : Number, default : 0},
    pengurangTerakhir: {type : Number, default : 0},
    provisi: {type : Number, default : 0}, 
    percentDP :{type : Number, default : 0},
    coverage :{type : String, default : '', trim : true},
    kreditProtection :{type : Number, default : 0},
    admInsurance  : {type : Number, default : 0}, 
    payPerMonth  : {type : Number, default : 0}, 
    cashNCarry  : {type : Number, default : 0},
    tglTambah: { type : Date, default : Date.now },
    tglUbah: { type : Date, default : Date.now },
    ditambahOleh: {
      nama : {type : String, default : '', trim : true},
      imgProfile : {type : String, default : '', trim : true},
      _id: {type:Schema.Types.ObjectId}
    },
    diubahOleh: {
      nama : {type : String, default : '', trim : true},
      imgProfile : {type : String, default : '', trim : true},
      _id: {type:Schema.Types.ObjectId}
    },
    status :{type : String, default : '', trim : true},
    cabang : {
        _id: {type:Schema.Types.ObjectId},
        kodeCabang: {type : String, default : '', trim : true},
        namaCabang: {type : String, default : '', trim : true}
    }
})

QuoteSchema.virtual('text').get(function () {
  return this.namaCustomer;
});

QuoteSchema.virtual('id').get(function () {
  return this._id;
});

QuoteSchema.virtual('imgProfile').get(function () {
  if(typeof this.customer!='undefined')
  return this.customer.imgProfile;

  return {};
});


QuoteSchema.set('toJSON', { getters: true, virtuals: true });

/**
 * Validations
 */

/**
 * Pre-remove hook
 */


/**
 * Methods
 */

QuoteSchema.methods = {

  /**
   * Save Properti and upload image
   *
   * @param {Object} images
   * @param {Function} cb
   * @api private
   */

  uploadAndSave: function (images, cb) {
    if (!images || !images.length) return this.save(cb)

    var imager = new Imager(imagerConfig, 'S3')
    var self = this

    imager.upload(images, function (err, cdnUri, files) {
      if (err) return cb(err)
      if (files.length) {
        self.image = { cdnUri : cdnUri, files : files }
      }
      self.save(cb)
    }, 'Properti')
  },

  /**
   * Add comment
   *
   * @param {Quote} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {
    var notify = require('../mailer/notify')

    this.comments.push({
      body: comment.body,
      user: user._id
    })

    notify.comment({
      Properti: this,
      currentQuote: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

QuoteSchema.statics = {

  /**
   * Find Properti by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .exec(cb)
  },

  /**
   * List Propertis
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */
  counts: function (options, cb) {
      var criteria = options.criteria || {}

      this.count(criteria)
          .exec(cb)
  },

  list: function (options, cb) {
    var criteria = options.criteria || {}
    var select = options.select || {}
    this.find(criteria)
      .limit(options.perPage)
      .skip(options.perPage * (options.page))
      .select(select)
      .sort({ tglTambah: 'desc' })
      .exec(cb)
  }

}

mongoose.model('Quote', QuoteSchema)
