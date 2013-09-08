
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , Imager = require('imager')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../config')[env]
  , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Properti Schema
 */

var KaryawanSchema = new Schema({
  username: {type: Schema.Types.ObjectId, ref: 'User'},
  password: {type : String, default : '', trim : true},
  imgProfile: {type : String, default : '', trim : true},
  nama: {type : String, default : '', trim : true},
  jenisIdentitas: {type : String, default : '', trim : true},
  noIdentitas: {type : String, default : '', trim : true},
  tempatLahir: {type : String, default : '', trim : true},
  alamat: {type : String, default : '', trim : true},
  telepon: {type : String, default : '', trim : true},
  hp1: {type : String, default : '', trim : true},
  hp2: {type : String, default : '', trim : true},
  email: {type : String, default : '', trim : true},
  bank: {type : String, default : '', trim : true},
  noRekening: {type : String, default : '', trim : true},
  atasNama: {type : String, default : '', trim : true},
  cabang: {type: Schema.Types.ObjectId, ref: 'Cabang'},
  status: {type : String, default : '', trim : true},
  tglTambah: { type : Date, default : Date.now },
  tglLahir: { type : Date, default : Date.now }
  
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

KaryawanSchema.methods = {

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
   * @param {Karyawan} user
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
      currentKaryawan: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

KaryawanSchema.statics = {

  /**
   * Find Properti by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email')
      .populate('comments.user')
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
      .populate({  path: 'username cabang'})
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * (options.page))
      .select(options.select)
      
      .exec(cb)
  }

}

mongoose.model('Karyawan', KaryawanSchema)
