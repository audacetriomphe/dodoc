<template>
  <div 
    class="m_mediaPublication"
    :style="`transform: translate(${mediaStyles.x}mm, ${mediaStyles.y}mm)`"
    :class="{ 'is--dragged' : is_dragged }"
    @click="updateMediaPosition({ x: Math.random() * 100, y: Math.random() * 100 })"
  >
    <MediaContent
      :context="'full'"
      :slugMediaName="media.slugMediaName"
      :slugProjectName="media.slugProjectName"
      :media="media"
      :read_only="read_only"
      v-model="media.content"
    />
    <button type="button" @click.stop="removeMedia()">
      retirer
    </button>
  </div>
</template>
<script>
import MediaContent from './MediaContent.vue';

export default {
  props: {
    media: Object,
    read_only: Boolean
  },
  components: {
    MediaContent
  },
  data() {
    return {
      is_dragged: false,
      dragOffset: {
        x: '',
        y: ''
      },
      mediaStylesOld: {
        x: '',
        y: ''
      },
      mediaStyles: {
        x: 0,
        y: 0
        // y: this.limitMediaYPos(parseFloat(this.media.y !== undefined ? this.media.y : 1)),
      }
    }
  },
  
  created() {
  },
  mounted() {

  },
  beforeDestroy() {
  },

  watch: {
    'media.publi_meta.x': function() {
      this.updateMediaStyles();
    },
    'media.publi_meta.y': function() {
      this.updateMediaStyles();
    }
  },
  computed: {
  },
  methods: {
    updateMediaStyles() {
      this.mediaStyles.x = this.media.publi_meta.hasOwnProperty('x') ? this.media.publi_meta.x : 5;
      this.mediaStyles.y = this.media.publi_meta.hasOwnProperty('y') ? this.media.publi_meta.y : 5;
    },
    updateMediaPosition({ x, y }) {
      console.log('editThisMedia');
      this.$emit('editPubliMedia', { reference_index: this.media.publi_meta.reference_index, x, y });
    },
    limitMediaYPos(yPos) {
      if (window.state.dev_mode === 'debug') {
        console.log(`METHODS • TimelineMedia: limitMediaYPos`);
      }
      return Math.max(100, Math.min(0, yPos));
    },
    removeMedia() {
      this.$emit('removeMedia', { reference_index: this.media.publi_meta.reference_index });
    },

    mousedown(event) {
      if (window.state.dev_mode === 'debug') {
        console.log(
          `METHODS • Publication: mousedown with is_dragged = ${
            this.is_dragged
          }`
        );
      }
      if (!this.read_only) {
        window.addEventListener('mousemove', this.mousemove);
        window.addEventListener('mouseup', this.mouseup);
      }
    },
    mousemove(event) {
      if (window.state.dev_mode === 'debug') {
        console.log(
          `METHODS • Publication: mousemove with is_dragged = ${
            this.is_dragged
          }`
        );
      }
      if (!this.is_dragged) {
        this.is_dragged = true;

        this.dragOffset.y = event.pageY;
        this.mediaStylesOld.y = this.mediaStyles.y;
      } else {
        let newY = this.mediaStylesOld.y + event.pageY - this.dragOffset.y;
        this.mediaStyles.y = this.limitMediaYPos(newY);
      }
    },
    // openMedia() {
    //   if (this.is_dragged) {
    //     return;
    //   }
    //   if (this.$root.state.dev_mode === 'debug') {
    //     console.log('METHODS • Publication: openMedia');
    //   }
    //   this.$emit('open');
    // },
    mouseup(event) {
      if (window.state.dev_mode === 'debug') {
        console.log(`METHODS • Publication: mouseup`);
        console.log(`with is_dragged = ${this.is_dragged}`);
      }
      if (this.is_dragged) {
        let newY = this.mediaStylesOld.y + event.pageY - this.dragOffset.y;
        this.mediaStyles.y = this.limitMediaYPos(newY);
        let getHeightInPercent = this.mediaStyles.y / this.timelineHeight;

        let values = {
          y: getHeightInPercent,
          slugFolderName: this.slugFolderName,
          slugMediaName: this.slugMediaName
        };

        this.$root.editMedia(values);
        this.is_dragged = false;
      }

      event.stopPropagation();
      window.removeEventListener('mousemove', this.mousemove);
      window.removeEventListener('mouseup', this.mouseup);

      return false;
    },
  }
}
</script>
<style>

</style>