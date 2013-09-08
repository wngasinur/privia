
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
  telepon: {type : String, default : '', trim : true},
  proposal : {  
    percentDP : {type:Number, default : 0},
    provisi : {type:Number, default : 0},
    admInsurance : {type:Number, default : 0}
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
      .sort({kodeCabang:'asc'})
      .exec(cb)
  }

}

mongoose.model('Cabang', CabangSchema)
