<template>
  <div class="m_project">

    <div class="m_project--presentation">
      <div class="m_project--presentation--vignette" @click="$root.openProject(slugProjectName)">
        <img v-if="previewURL"
          :src="previewURL" class=""
        />
      </div>
      <div class="m_project--presentation--text">
        <h2 
          class="m_project--presentation--text--title"
           @click="$root.openProject(slugProjectName)"
        >
          {{ project.name }}    
        </h2>

        <div class="m_project--presentation--text--infos">
          <mark class="" v-if="project.password === 'has_pass'">
            {{ $t('protected_by_pass') }}
          </mark>

          <div class="m_metaField">
            <div>
              {{ $t('created') }}
            </div>
            <div>
              {{ formatDateToHuman(project.date_created) }}
            </div>
          </div>
          <div class="m_metaField">
            <div>
              {{ $t('edited') }}
            </div>
            <div>
              {{ formatDateToHuman(project.date_modified) }}
            </div>
          </div>
        </div>
      </div>

      <div 
        class="m_project--presentation--buttons"
      >
        <button 
          v-if="project.authorized && context !== 'full'"
          type="button" 
          class="button-redthin" 
          @click="$root.openProject(slugProjectName)"
        >
          <span class="">
            {{ $t('open') }}
          </span>
        </button>
        <button v-if="!project.authorized" type="button" class="buttonLink" :readonly="read_only" @click="showInputPasswordField = !showInputPasswordField">
          {{ $t('password') }}
        </button>
        <button v-if="project.authorized && context === 'full'" type="button" class="buttonLink" @click="showEditProjectModal = true" :disabled="read_only">
          {{ $t('edit') }}
        </button>
        <button v-if="project.authorized && context === 'full'" type="button" class="buttonLink" @click="removeProject()" :disabled="read_only">
          {{ $t('remove') }}
        </button>

        <div v-if="showInputPasswordField" class="margin-bottom-small">
          <input type="password" ref="passwordField" @keyup.enter="submitPassword" autofocus placeholder="…">
          <button type="button" class="border-circled button-thin padding-verysmall" @click="submitPassword">Envoyer</button>
        </div>
      </div>

      <EditProject
        v-if="showEditProjectModal"
        :project="project"
        :slugProjectName="slugProjectName"
        @close="showEditProjectModal = false"
        :read_only="read_only"
      />
    </div>

    <!-- <div class="m_project--description"
      v-if="context === 'full'"
    >
      <p>
        Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
      </p>
    </div> -->

    <div class="m_project--favMedias"
      v-if="context === 'full'"
    >
      <div class="sectionTitle_small margin-sides-medium">
        Média favoris
      </div>

      <div class="m_project--favMedias--list">
        <MediaCard
          v-if="favMedias !== undefined"
          v-for="media in favMedias"
          :key="media.slugMediaName"
          :media="media"
          :slugProjectName="slugProjectName"
        >
        </MediaCard>
      </div>
    </div>

    <MediaLibrary
      v-if="context === 'full'"
      :slugProjectName="slugProjectName"
      :project="project"
      :read_only="read_only"
    >
    </MediaLibrary>

    <button 
      type="button" 
      class="captureButton"
      v-if="context === 'full' && ((project.password === 'has_pass' && project.authorized) || project.password !== 'has_pass') && $root.state.connected"
      @click="$root.settings.view = 'CaptureView'"
      :disabled="read_only" 
    >
      <img src="/images/i_record.svg" width="48" height="48" />
      <span>    
          {{ $t('capture') }}
      </span>
    </button>
  </div>
</template>
<script>
import EditProject from './modals/EditProject.vue';
import MediaLibrary from './MediaLibrary.vue';
import MediaCard from './subcomponents/MediaCard.vue';
import _ from 'underscore';

export default {
  props: {
    project: Object,
    slugProjectName: String,
    read_only: Boolean,
    index: Number,
    context: String
  },
  components: {
    EditProject,
    MediaLibrary,
    MediaCard
  },
  data() {
    return {
      debugProjectContent: false,
      showEditProjectModal: false,
      showInputPasswordField: false
    };
  },
  watch: {
  },
  mounted() {
  },
  beforeDestroy() {
  },

  computed: {
    favMedias() {
      if(Object.keys(this.project.medias).length === 0) {
        return [];
      }
      const favMedias = {};
      Object.keys(this.project.medias).map((m) => {
        if(this.project.medias[m].fav === true) {
          favMedias[m] = this.project.medias[m];
        }
      });
      return favMedias;
    },
    previewURL() {
      if(this.project.preview === '') {
        return false;
      }
      return `/${this.slugProjectName}/${this.project.preview}?${(new Date()).getTime()}`;
    }
  },
  methods: {
    formatDateToHuman(date) {
      return this.$moment(date, 'YYYY-MM-DD HH:mm:ss').format('LLL');
    },
    openProject() {
      this.$root.openProject(this.slugProjectName);
    },
    closeProject() {
      this.$root.closeProject();
    },
    removeProject() {
      if (window.confirm(this.$t('sureToRemoveProject'))) {
        this.$root.removeFolder({ 
          type: 'projects', 
          slugFolderName: this.slugProjectName
        });
        this.closeProject();
      }
    },
    submitPassword() {
      console.log('METHODS • Project: submitPassword');
      auth.updateAdminAccess({
        [this.slugProjectName]: this.$refs.passwordField.value
      });
      this.$socketio.sendAuth();
      this.showInputPasswordField = false;
    },
  },
};
</script>
<style scoped>

</style>