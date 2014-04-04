// Copyright 2014 Globo.com Player authors. All rights reserved.
// Use of this source code is governed by a BSD-style
// license that can be found in the LICENSE file.

var UIPlugin = require('../../base/ui_plugin');
var Styler = require('../../base/styler');

var HTML5VideoPlaybackPlugin = UIPlugin.extend({
  name: 'html5_video_playback',
  type: 'playback',
  tagName: 'video',
  attributes: {
    'data-html5-video': ''
  },

  events: {
    'timeupdate': 'timeUpdated',
    'progress': 'progress',
    'ended': 'ended'
  },

  initialize: function(options) {
    this.el.src = options.src;
    this.settings = {
      left: ['playpause'],
      right: ['fullscreen', 'volume'],
      default: ['position', 'seekbar', 'duration']
    };
  },

  play: function() {
    this.el.play();
  },

  pause: function() {
    this.el.pause();
  },

  stop: function() {
    this.pause();
    this.el.currentTime = 0;
  },

  volume: function(value) {
    this.el.volume = value / 100;
  },

  mute: function() {
    this.el.volume = 0;
  },

  unmute: function() {
    this.el.volume = 1;
  },

  isMuted: function() {
    return !!this.el.volume;
  },

  isPlaying: function() {
    return !this.el.paused && !this.el.ended;
  },

  ended: function() {
    this.trigger('playback:ended');
    this.trigger('playback:timeupdate', 0, this.el.duration);
  },

  destroy: function() {
    this.stop();
    this.el.src = '';
    this.$el.remove();
  },

  seek: function(seekBarValue) {
    var time = this.el.duration * (seekBarValue / 100);
    this.el.currentTime = time;
  },

  getCurrentTime: function() {
    return this.el.currentTime;
  },

  getDuration: function() {
    return this.el.duration;
  },

  timeUpdated: function() {
    this.trigger('playback:timeupdate', this.el.currentTime, this.el.duration);
  },

  progress: function() {
    if (!this.el.buffered.length) return;
    var bufferedPos = 0;
    for (var i = 0;  i < this.el.buffered.length; i++) {
      if (this.el.currentTime >= this.el.buffered.start(i) && this.el.currentTime <= this.el.buffered.end(i)) {
        bufferedPos = i;
        break;
      }
    }
    this.trigger('playback:progress', this.el.buffered.start(bufferedPos), this.el.buffered.end(bufferedPos), this.el.duration);
  },

  render: function() {
    var style = Styler.getStyleFor(this.name);
    this.$el.append(style);
    this.trigger('playback:ready');
    return this;
  }
});

HTML5VideoPlaybackPlugin.canPlay = function(resource) {
    return !!resource.match(/(.*).mp4/);
}

module.exports = HTML5VideoPlaybackPlugin;

