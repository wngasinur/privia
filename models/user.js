
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

var UserSchema = new Schema({
  username: {type : String, default : '', trim : true, unique: true},
  password: {type : String, default : '', trim : true},
  status: {type : String, default : '', trim : true},
  tglTambah: { type : Date, default : Date.now },
  tglTerakhirLogin: { type : Date, default : Date.now },
  akses: {type : Array},
  karyawan : {
    _id: {type:Schema.Types.ObjectId},
    imgProfile: {type : String, default : '', trim : true},
    nama: {type : String, default : '', trim : true}
  },
  cabang: {
    _id: {type:Schema.Types.ObjectId},
    kodeCabang: {type : String, default : '', trim : true},
    namaCabang: {type : String, default : '', trim : true}
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

UserSchema.methods = {

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
  isAdmin:function(){
    console.log(this.akses);
    return true;
  },
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

UserSchema.statics = {

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

mongoose.model('User', UserSchema)
