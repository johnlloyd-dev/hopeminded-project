<template>
    <div class="body">
        <div class="d-flex">
            <div class="main-content mx-5 w-100 h-100">
                <div class="my-3">
                    <button @click="navigate()" class="btn-secondary btn rounded-0">
                        Back
                    </button>
                    <div class="row mb-3">
                        <div class="col-lg-12 mt-2">
                            <div class="btn-group">
                                <button class="btn btn-lg btn-success dropdown-toggle rounded-0" type="button"
                                    id="defaultDropdown" data-bs-toggle="dropdown" data-bs-auto-close="true"
                                    aria-expanded="false">
                                    Select Chapter
                                </button>
                                <ul class="dropdown-menu" aria-labelledby="defaultDropdown">
                                    <li><button class="dropdown-item"
                                            :class="{ active: selectedChapter == 1 }"
                                            @click="selectChapter(1)">Chapter 1</button></li>
                                    <li><button class="dropdown-item"
                                            :class="{ active: selectedChapter == 2 }"
                                            @click="selectChapter(2)">Chapter 2</button></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                    <AlphabetsLetters
                        :chapter="selectedChapter"
                        v-if="textbookFlag == 'alphabet-letters'"/>
                    <AlphabetsWords
                        :chapter="selectedChapter"
                        v-if="textbookFlag == 'alphabet-words'"/>
                    <VowelsConsonants
                        :chapter="selectedChapter"
                        v-if="textbookFlag == 'vowel-consonants'"/>
                    <Numbers
                        :chapter="selectedChapter"
                        v-if="textbookFlag == 'numbers'"/>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import AlphabetsLetters from './textbook-management/AlphabetsLetters.vue'
import AlphabetsWords from './textbook-management/AlphabetsWords.vue'
import VowelsConsonants from './textbook-management/VowelsConsonants.vue'
import Numbers from './textbook-management/Numbers.vue'
export default {
    components: {
        AlphabetsLetters,
        AlphabetsWords,
        VowelsConsonants,
        Numbers
    },
    data() {
        return {
            selectedChapter: 1,
            isSwitching: false
        }
    },
    created() {

    },
    computed: {
        textbookFlag() {
            return this.$route.params.textbookFlag
        }
    },
    methods: {
        navigate() {
            this.$router.push({ path: `/textbook-management` })
        },
        selectChapter(value) {
            this.selectedChapter = value
            this.isSwitching = true
            setTimeout(() => {
                this.isSwitching = false
            }, 500);
        },
    },
}
</script>

<style lang="scss" scoped>
.body {
    background-image: url("/images/background.jpg");
    background-size: cover;
    background-repeat: no-repeat;
    background-attachment: fixed;
    color: #333;
    padding: 0;
    margin: 0;
    height: 100vh;
    overflow-x: hidden;
}
</style>
