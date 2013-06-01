
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

var PropertiSchema = new Schema({
  tipe: {type : String, default : '', trim : true},
  harga: {type : String, default : '', trim : true},
  luasRumah: {type : Number, default : 0},
  
  luas: [{
    rumah: {type : Number, default : 0},
    tanah: {type : Number, default : 0}
 
  }],
  createdAt: { type : Date, default : Date.now }
  ,image: {
    cdnUri: String,
    files: []
  }
  
})

/**
 * Validations
 */

PropertiSchema.path('tipe').validate(function (tipe) {
  return tipe.length > 0
}, 'Properti tipe cannot be blank')

PropertiSchema.path('harga').validate(function (harga) {
  return harga != 0
}, 'Properti harga cannot be blank')

/**
 * Pre-remove hook
 */

PropertiSchema.pre('remove', function (next) {
  var imager = new Imager(imagerConfig, 'S3')
  var files = this.image.files

  // if there are files associated with the item, remove from the cloud too
  imager.remove(files, function (err) {
    if (err) return next(err)
  }, 'Properti')

  next()
})

/**
 * Methods
 */

PropertiSchema.methods = {

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
   * @param {User} user
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
      currentUser: user,
      comment: comment.body
    })

    this.save(cb)
  }

}

/**
 * Statics
 */

PropertiSchema.statics = {

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

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Properti', PropertiSchema)
