<template>
  <div class="m_publicationsview">

    <div class="m_actionbar">
      <div class="m_actionbar--buttonBar">
        <button 
          class="barButton barButton_createPubli"
          type="button"  
          @click="showCreatePublicationModal = true"
          :disabled="read_only" 
        >
          <span>    
              {{ $t('create_a_publication') }}
          </span>
        </button>

        <CreatePublication
          v-if="showCreatePublicationModal"
          @close="showCreatePublicationModal = false"
          :read_only="read_only"
        />
      </div>
      <div class="m_actionbar--text">
        {{ $t('publication_list') }}
      </div>
    </div>    
    <div class="m_publicationItems">
      <div 
        v-if="typeof publications === 'object'"
        class="m_publicationItems--item"
        v-for="publication in publications"
        :key="publication.slugFolderName"
      >
        <h2 class="m_publicationItems--item--title"
          @click="openPublication(publication.slugFolderName)"
        >
          {{ publication.name }}
        </h2>

        <!-- <div class="m_metaField">
          <div>
            {{ $t('created') }}
          </div>
          <div>
            {{ $root.formatDateToHuman(publication.date_created) }}
          </div>
        </div> -->
        <div>
          <div class="m_metaField">
            <div>
              {{ $t('template') }}
            </div>
            <div>
              {{ $t(publication.template) }}
            </div>
          </div>
          <!-- <div class="m_metaField">
            <div>
              {{ $t('edited') }}
            </div>
            <div>
              {{ $root.formatDateToHuman(publication.date_modified) }}
            </div>
          </div> -->
          <div class="m_metaField">
            <div>
              {{ $t('number_of_pages') }}
            </div>
            <div>
              <template v-if="!!publication.pages">
                {{ Object.keys(publication.pages).length }}
              </template>
              <template v-else>
                0
              </template>
            </div>
          </div>
        </div>

        <button 
          type="button" 
          class="button-redthin" 
          @click="openPublication(publication.slugFolderName)"
        >
          <span class="">
            {{ $t('open') }}
          </span>
        </button>

      </div>
    </div>
  </div>
</template>
<script>
import CreatePublication from './components/modals/CreatePublication.vue';

export default {
  props: ['publications', 'read_only'],
  components: {
    CreatePublication
  },
  data() {
    return {
      showCreatePublicationModal: false
    }
  },
  
  created() {
  },
  mounted() {
  },
  beforeDestroy() {
  },

  watch: {
  },
  computed: {
  },
  methods: {
    openPublication(slugPubliName) {
      if (this.$root.state.dev_mode === 'debug') {
        console.log(`METHODS • Publications: openPublication / slugPubliName = ${slugPubliName}`);
      }
      this.$root.openPublication(slugPubliName);
    }
  }
}
</script>
<style>

</style>