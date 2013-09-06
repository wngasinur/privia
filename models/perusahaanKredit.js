
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

 var PerusahaanKreditSchema = new Schema({
  inisial: {type : String, default : '', trim : true},
  namaPerusahaanKredit: {type : String, default : '', trim : true},
  kreditProtection: {type : Boolean,default:false},
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
  sukuBunga: {
    thn1 : {type : Number, default : 0},
    thn2 : {type : Number, default : 0},
    thn3 : {type : Number, default : 0},
    thn4 : {type : Number, default : 0}
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

 PerusahaanKreditSchema.methods = {

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
   * @param {PerusahaanKredit} user
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
      currentPerusahaanKredit: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

 PerusahaanKreditSchema.statics = {

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
    .sort({inisial:'asc'})
    .exec(cb)
  }

}

mongoose.model('PerusahaanKredit', PerusahaanKreditSchema)
