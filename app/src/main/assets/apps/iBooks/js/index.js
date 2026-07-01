'use strict';

/*
|----------------------------------------------------
| A little BEM helper, not required though
|----------------------------------------------------
*/
var BEM = {
  computed: {
    BEMBlock: function BEMBlock() {
      return 'v-' + this.$options.name;
    },
    BEMElement: function BEMElement() {
      return 'v-' + this.$parent.$options.name + '__' + this.$options.name;
    }
  }
};

/*
|----------------------------------------------------
| Some Mock Data
|----------------------------------------------------
*/

var ARTBOOKS = [{
  id: '001',
  title: 'Artworks',
  subtitle: 'Tactics Ogre',
  description: 'Full page and full color llustrations Sketches, for the game. 8.25" x 11.75", 232 pgs, all in color.',
  image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/16584/tactics_ogre_cover.jpg',
  groove: true,
  obiStyles: {
    color: 'hsl(0, 0, 22%)',
    backgroundColor: 'hsla(48, 89%, 50%, .22)',
    textAlign: 'right'
  }
}, {
  id: '002',
  title: 'The Art of Eorzea',
  subtitle: 'Final Fantasy XIV',
  description: 'One book that was recorded illustrations were drawn in the production process of summarizing the whole world released. "Shinsei Eoruzea" Genesis of record "Final Fantasy XIV" the first official art book of "Shinsei FFXIV"',
  image: 'https://s3-us-west-2.amazonaws.com/s.cdpn.io/16584/ffxiv_taoe_cover.jpg',
  groove: true,
  bookStyles: {
    color: 'hsl(0, 100%, 100%)',
    backgroundColor: 'hsl(150, 8%, 5%)'
  },
  obiStyles: {
    color: 'hsl(0, 100%, 100%)',
    backgroundColor: 'hsla(0, 0%, 0%, .22)',
    textAlign: 'right'
  }
}];

/*
|----------------------------------------------------
| Book Components
|----------------------------------------------------
*/
Vue.component('book', {
  mixins: [BEM],
  props: ['title', 'subtitle', 'description', 'image', 'groove', 'book-styles', 'obi-styles'],
  data: function data() {
    return {
      isFlipped: false,
      classObject: {
        'has-groove': this.groove
      }
    };
  },

  template: '\n    <article @click="flip" :class="[BEMBlock, classObject, { \'is-flipped\' : isFlipped }]">\n      <obi \n       :title="title" \n       :subtitle="subtitle" \n       :book-styles="bookStyles" \n       :obi-styles="obiStyles" \n       :front="true">\n      </obi>\n      <cover :image="image" :book-styles="bookStyles" front>\n        <section slot="front"></section>\n      </cover>\n      <spine :book-styles="bookStyles"></spine>\n      <cover :book-styles="bookStyles" back>\n        <p slot="back" class="v-book__description" v-text="description"></p>\n      </cover>\n      <obi :obi-styles="obiStyles"></obi>\n    </article>\n  ',
  methods: {
    flip: function flip() {
      this.isFlipped = !this.isFlipped;
    }
  }
});

/*
|----------------------------------------------------
| The Obi, or Belly Band, around the book
|----------------------------------------------------
*/
Vue.component('obi', {
  props: ['title', 'subtitle', 'obi-styles', 'front'],
  template: '\n    <div class="v-book__obi" :style="obiStyles" :class="{ \'is-back\': !front }">\n      <div v-if="front">\n        <div v-if="subtitle" class="v-book__subtitle" v-text="subtitle"></div>\n        <div v-if="title" class="v-book__title" v-text="title"></div>\n      </div>\n    </div>\n  '
});

Vue.component('cover', {
  mixins: [BEM],
  props: ['front', 'back', 'image', 'book-styles'],
  data: function data() {
    return {
      loading: false,
      classObject: {
        'is-back': this.back !== undefined,
        'is-front': this.front !== undefined
      }
    };
  },

  computed: {

    /*A makeshift lazy-load that fixes the jittering
      when the cover image is loaded. In a "real"
      situation you would probably do something
      more proper. */
    coverImage: function coverImage() {
      var vm = this;
      var img = new Image();
      var url = this.image;
      vm.loading = true;

      img.onload = function () {
        img.src = url;
      };

      if (img.complete) {
        vm.loading = false;
      }

      return {
        backgroundImage: 'url(' + this.image + ')'
      };
    }
  },
  template: '\n    <section :class="[BEMElement, classObject]" :style="[bookStyles, coverImage]">\n      <loader v-if="loading"></loader>\n      <slot name="front"></slot>\n      <slot name="back"></slot>\n    </section>\n  '
});

/* 
Admitted, a separate component for a spine is a bit overkill,
but what the heck. We're just having fun here. */
Vue.component('spine', {
  mixins: [BEM],
  props: ['book-styles'],
  template: '\n    <section :class="[BEMElement]" :style="[bookStyles]"></section>\n  '
});

Vue.component('loader', {
  props: ['is-loading'],
  template: '\n    <div class="v-loader">✵</div>\n  '
});

new Vue({
  el: document.getElementsByTagName('body')[0],
  data: {
    books: {
      artbooks: ARTBOOKS
    }
  },
  methods: {

    /* A note on staggering, or that neat, delayed 
    fade in effect on the books. In Vue 2.0, you
    have to combine the special <transition-group>
    tag along with a few methods like these below
    to get a result like the one you see.
    
    Basically, we first decide what "state" the
    book should be in BEFORE it enters the stage
    and then WHEN it enters the stage, we change
    that state to how it should end up.
    */
    beforeItemEnters: function beforeItemEnters(el) {
      el.style.opacity = 0;
      el.style.top = '-10px';
    },
    whenItemEnters: function whenItemEnters(el) {
      var delay = el.dataset.index * 500;
      setTimeout(function () {
        el.style.opacity = 1;
        el.style.top = '0px';
      }, delay);
    }
  }
});