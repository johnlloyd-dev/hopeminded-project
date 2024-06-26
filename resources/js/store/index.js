import { createStore } from "vuex";
export const store = new createStore({
    namespaced: true,
    state: {
        authenticated: false,
        user: {},
        menuFlag: null,
        alphabetLetters: {},
        vowelConsonants: {},
        alphabetWords: {},
        numbers: [],
        quizInfo: {},
        selectedChapter: null,
        isLoading: false,
        quantityRequirement: {}
    },
    getters: {
        authenticated(state) {
            return state.authenticated;
        },
        user(state) {
            return state.user;
        },
        menuFlag(state) {
            return state.menuFlag;
        },
        alphabetLetters(state) {
            return state.alphabetLetters;
        },
        vowelConsonants(state) {
            return state.vowelConsonants;
        },
        alphabetWords(state) {
            return state.alphabetWords;
        },
        quizInfo(state) {
            return state.quizInfo;
        },
        selectedChapter(state) {
            return state.selectedChapter;
        },
        isLoading(state) {
            return state.isLoading
        },
        quantityRequirement(state) {
            return state.quantityRequirement
        },
        numbers(state) {
            return state.numbers
        }
    },
    mutations: {
        SET_AUTHENTICATED(state, value) {
            state.authenticated = value;
        },
        SET_USER(state, value) {
            state.user = value;
        },
        SET_MENU_FLAG(state, menuFlag) {
            state.menuFlag = menuFlag;
        },
        SET_ALPHABET_LETTERS_DATA(state, data) {
            state.alphabetLetters = data;
        },
        SET_VOWEL_CONSONANTS_DATA(state, data) {
            state.vowelConsonants = data;
        },
        SET_ALPHABET_WORDS_DATA(state, data) {
            state.alphabetWords = data;
        },
        SET_NUMBERS_DATA(state, data) {
            state.numbers = data;
        },
        SET_QUIZ_INFO(state, data) {
            state.quizInfo = data;
        },
        SET_SELECTED_CHAPTER(state, data) {
            state.selectedChapter = data;
        },
        SET_ISLOADING(state, data) {
            state.isLoading = data
        },
        SET_QUANTITY_REQUIREMENT(state, data) {
            state.quantityRequirement = data
        }
    },
    actions: {
        login(context, { users }) {
            context.commit("SET_USER", users);
            context.commit("SET_AUTHENTICATED", true);
        },
        logout(context) {
            context.commit("SET_USER", {});
            context.commit("SET_AUTHENTICATED", false);
        },
        setMenuFlag(context, menuFlag) {
            context.commit("SET_MENU_FLAG", menuFlag);
        },
        async setAlphabetLetters(context, flag) {
            try {
                context.commit("SET_ISLOADING", true);
                const alphabets = await axios.get(`/api/alphabets-letters/get?user=${'student'}&chapter=1`);
                context.commit("SET_ALPHABET_LETTERS_DATA", alphabets.data);
            } catch (error) {
                console.log(error)
            } finally {
                context.commit("SET_ISLOADING", false);
            }
        },
        async setNumbers(context, flag) {
            try {
                context.commit("SET_ISLOADING", true);
                const numbers = await axios.get('/api/textbook/numbers', {
                    params: {
                        chapter: 1,
                        user: 'student'
                    }
                });
                context.commit("SET_NUMBERS_DATA", numbers.data);
            } catch (error) {
                console.log(error)
            } finally {
                context.commit("SET_ISLOADING", false);
            }
        },
        async setVowelConsonants(context, flag) {
            try {
                context.commit("SET_ISLOADING", true);
                let newData = []
                const alphabets = await axios.get(`/api/vowels-consonants/get?user=${'student'}&chapter=1`);
                context.commit("SET_VOWEL_CONSONANTS_DATA", alphabets.data);
            } catch (error) {
                console.log(error)
            } finally {
                context.commit("SET_ISLOADING", false);
            }
        },
        async setAlphabetWords(context) {
            try {
                context.commit("SET_ISLOADING", true);
                const alphabets = await axios.get(
                    `/api/alphabets-words/get?user=${'student'}&chapter=1`
                );
                context.commit("SET_ALPHABET_WORDS_DATA", alphabets.data);
            } catch (error) {
                console.log(error)
            } finally {
                context.commit("SET_ISLOADING", false);
            }
        },
        async getQuizInfo(context, tutorial) {
            let data = [];
            if(tutorial) {
                data = await axios.get("/api/quiz/info/get?flag=tutorial");
            } else {
                data = await axios.get("/api/quiz/info/get");
            }
            context.commit("SET_QUIZ_INFO", data.data);
        },
        async setSelectedChapter(context, chapter) {
            context.commit("SET_SELECTED_CHAPTER", chapter);
        },
        async getQuantityRequiement(context, flag) {
            try {
                const response = await axios.get(`/api/quantity-requirements/get`)

                if (response.status == 200) {
                    context.commit("SET_QUANTITY_REQUIREMENT", response.data);
                }
            } catch (error) {
                console.log.apply(error)
            }
        },
    },
});
