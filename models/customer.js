
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

var CustomerSchema = new Schema({
  noIdentitas: {type : String, default : '', trim : true},

    imgProfile: {type : String, default : '', trim : true},

    tipeIdentitas: {type : String, default : '', trim : true},
  namaCustomer: {type : String, default : '', trim : true},
  gender: {type : String, default : '', trim : true},
  kantor: {type : String, default : '', trim : true},
  alamat: {
      jalan : {type : String, default : '', trim : true},
      rt : {type : String, default : '', trim : true},
      rw : {type : String, default : '', trim : true},
      lurah : {type : String, default : '', trim : true},
      camat : {type : String, default : '', trim : true},
      kotamadya : {type : String, default : '', trim : true},
      kodePos: {type : String, default : '', trim : true},
      kota: {type : String, default : '', trim : true}
  },
    telepon: {
        rmh : {type : String, default : '', trim : true},
        kantor : {type : String, default : '', trim : true},
        hp1 : {type : String, default : '', trim : true},
        hp2 : {type : String, default : '', trim : true}
    },
    email: {type : String, default : '', trim : true},
      bank: {
          nama : {type : String, default : '', trim : true},
          noRekening : {type : String, default : '', trim : true},
          atasNama : {type : String, default : '', trim : true}
      }
})

/**
 * Validations
 */

/**
 * Pre-remove hook
 */


/**
 * Methods
 */

CustomerSchema.methods = {

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
   * @param {Customer} user
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
      currentCustomer: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

CustomerSchema.statics = {

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
      .exec(cb)
  }

}

mongoose.model('Customer', CustomerSchema)
