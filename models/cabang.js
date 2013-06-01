
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

var CabangSchema = new Schema({
  kodeCabang: {type : String, default : '', trim : true, unique: true},
  namaCabang: {type : String, default : '', trim : true},
  alamat: {type : String, default : '', trim : true},
  kodePos: {type : String, default : '', trim : true},
  kota: {type : String, default : '', trim : true},
  telepon: {type : String, default : '', trim : true}
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

CabangSchema.methods = {

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
   * @param {Cabang} user
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
      currentCabang: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

CabangSchema.statics = {

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
      .limit(options.perPage)
      .skip(options.perPage * (options.page))
      .select(options.select)
      .exec(cb)
  }

}

mongoose.model('Cabang', CabangSchema)
