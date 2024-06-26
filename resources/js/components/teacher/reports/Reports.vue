<template>
    <div class="body position-relative">
        <div class="d-flex">
            <div class="main-content mx-5 w-100 h-100">
                <div class="my-3 d-flex d-flex justify-content-between align-items-center">
                    <button @click="navigate()" class="btn-secondary btn rounded-0">
                        Back
                    </button>
                    <div class="perfect-score-handler">
                        <div>
                            <h4 class="mb-0"><span class="student-title">{{ Object.keys(studentInfo).length ? `${studentInfo.last_name}, ${studentInfo.first_name} ${(studentInfo && studentInfo.middle_name ? studentInfo.middle_name.charAt(0) + '.' : '')}` : '' }}</span></h4>
                        </div>
                    </div>
                </div>
                <div class="d-flex justify-content-between mb-3">
                    <div class="btn-group" role="group" aria-label="Basic radio toggle button group">
                        <input type="radio" class="btn-check" v-model="gameId" :value="1" id="btnradio1" autocomplete="off"
                            :checked="gameId == 1">
                        <label class="btn btn-outline-dark fw-bold rounded-0"
                            :class="gameId == 1 ? 'text-white' : 'text-black'" for="btnradio1">Hangman Game</label>

                        <input type="radio" class="btn-check" v-model="gameId" :value="2" id="btnradio2" autocomplete="off"
                            :checked="gameId == 2">
                        <label class="btn btn-outline-dark fw-bold rounded-0"
                            :class="gameId == 2 ? 'text-white' : 'text-black'" for="btnradio2">Typing Balloon</label>

                        <input type="radio" class="btn-check" v-model="gameId" :value="3" id="btnradio3" autocomplete="off"
                            :checked="gameId == 3">
                        <label class="btn btn-outline-dark fw-bold rounded-0"
                            :class="gameId == 3 ? 'text-white' : 'text-black'" for="btnradio3">Memory Game</label>

                        <input type="radio" class="btn-check" v-model="gameId" :value="4" id="btnradio4" autocomplete="off"
                            :checked="gameId == 4">
                        <label class="btn btn-outline-dark fw-bold rounded-0"
                            :class="gameId == 4 ? 'text-white' : 'text-black'" for="btnradio4">Matching Game</label>
                    </div>
                </div>
                <AlphabetReports ref="AlphabetReports"
                    :reports="reports"
                    :student-id="studentId"
                    :flag="flag"
                    :game-name="gameName"
                    :quiz-report-highest-score="quizReportHighestScore"
                    :quiz-report-retake="quizReportRetake" />
            </div>
        </div>
    </div>
</template>

<script>
import swal from 'sweetalert2'
import Loading from '../../loading/Loading.vue'
import AlphabetReports from '../reports/AlphabetReports.vue'

export default {
    components: {
        AlphabetReports,
        Loading
    },
    data() {
        return {
            reports: [],
            data: [],
            skillTest: [],
            gameId: 1,
            studentId: null,
            file: '',
            certificates: [],
            quizReportHighestScore: 0,
            quizReportRetake: [],
            isModifyPerfectScore: false,
            perfectScoreError: false,
            isProcessing: false,
            isLoading: false,
            perfectScoreMessage: null,
            errors: [],
            perfect_score: {},
            studentInfo: {},
            default_perfect_score: 10,
            flag: 'alphabet-words',
            setScore: {
                score: null,
                perfect_score_id: null
            },
            formData: {
                statusMark: 'correct'
            },
            indexes: {
                skillTest: 'a'
            },
            certificate: {
                file: null
            }
        }
    },
    created() {
        this.studentId = this.$route.params.studentId
        this.getReports()
        this.getCertificates()
        // this.getSkillTest()
        this.getStudentInfo()
        this.getPerfectScore()
    },
    beforeUnmount() {
        $('#skillTestModal').modal('hide')
    },
    watch: {
        gameId(value) {
            if (value === 1)
                this.flag = 'alphabet-words'
            else if (value === 2)
                this.flag = 'vowel-consonants'
            else if (value === 3)
                this.flag = 'alphabet-letters'
            else
                this.flag = 'numbers'

            this.certificates = []
            this.isLoading = true
            this.filterReports()
            this.getCertificates()
        },
        flag() {
            this.skillTest = []
            this.isLoading = true
            // this.getSkillTest()
        }
    },
    computed: {
        gameName() {
            if (this.gameId == 1) {
                return 'Hangman Game/Alphabets-Words'
            } else if (this.gameId == 2) {
                return 'Typing Balloon/Vowels-Consonants'
            } else if (this.gameId == 3) {
                return 'Memory Game/Alphabets-Letters'
            } else {
                return 'Matching Game/Numbers'
            }
        },
        selectedSkillTest() {
            return this.skillTest[this.indexes.skillTest] ?? []
        }
    },
    methods: {
        async getReports() {
            this.isLoading = true
            try {
                const data = await axios.get(`/api/quiz-report/student/${this.studentId}?flag=${this.flag}`)
                this.data = data.data
                this.filterReports()
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },
        async getCertificates() {
            this.isLoading = true
            try {
                const response = await axios.get(`/api/certificates/student/${this.studentId}/game-id/${this.gameId}`)
                this.certificates = response.data
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },
        async getPerfectScore() {
           try {
                const response = await axios.get(`/api/perfect-score/get?student_id=${this.studentId}`)
                this.perfect_score = response.data
                this.setScore.score = response.data.score ?? this.default_perfect_score
            } catch (error) {
                console.log(error)
            }
        },
        async getSkillTest() {
            this.isLoading = true
            try {
                const data = await axios.get(`/api/skill-test/fetch/${this.flag}?student_id=${this.studentId}`)
                const mergedObject = data.data.reduce((result, item) => {
                    const { letter, ...rest } = item;

                    if (result[letter]) {
                        result[letter].push(rest);
                    } else {
                        result[letter] = [rest];
                    }

                    return result;
                }, {});

                this.skillTest = mergedObject
                this.indexes.skillTest = Object.keys(mergedObject)[0]
            } catch (error) {
                console.log(error)
            } finally {
                this.isLoading = false
            }
        },
        async modifyPerfectScore() {
            if (this.perfect_score.id)
                this.setScore.perfect_score_id = this.perfect_score.id
                this.setScore.score = parseInt(this.setScore.score)

            try {
                const response = await axios.post(`/api/perfect-score/modify?flag=${this.flag}&student_id=${this.studentId}`, this.setScore)
                this.perfectScoreMessage = response.data.message
                this.getPerfectScore()
                this.$refs.AlphabetReports.getSkillTest()
                swal.fire('Success', response.data.message, 'success')
                this.isModifyPerfectScore = !this.isModifyPerfectScore
                this.perfectScoreError = false
            } catch (error) {
                this.perfectScoreError = true
            }
        },
        percentage(score) {
            if (this.gameId == 1) {
                return Math.round((score / 18) * 100);
            } else if (this.gameId == 2) {
                return Math.round((score / 51) * 100);
            } else if (this.gameId == 3) {
                return Math.round((score / 59) * 100);
            } else {
                return Math.round((score / 24) * 100);
            }
        },
        filterReports() {
            this.quizReportHighestScore = []
            this.reports = this.data.data.filter((data) => {
                return data.game_id == this.gameId
            })
            if (Object.keys(this.reports).length) {
                this.quizReportHighestScore = this.data.highest_score ?? 0
                this.quizReportRetake = this.data.retake ?? []
            }
        },
        alphabetHandler(letter) {
            this.indexes.skillTest = letter
        },
        navigate() {
            this.$router.push('/student-management')
        },
        parseFile(event) {
            this.file = event.target.files[0];
        },
        async uploadCertificate() {
            try {
                this.isProcessing = true
                this.errors = []
                let formData = new FormData();
                formData.append("gameId", this.gameId);
                formData.append("studentId", this.studentId);
                formData.append("file", this.file);
                const response = await axios.post('/api/certificate/upload', formData);
                if (response.status) {
                    this.file = null
                    this.$refs.fileInput.value = '';
                    swal.fire('Success', response.data.message, 'success')
                    this.getCertificates()
                }
            } catch (error) {
                this.errors = error.response.data.errors;
                // Handle the error, e.g., show an error message
            } finally {
                this.isProcessing = false
            }
        },
        async deleteCertificate(id, filePath) {
            const data = { id: id, file: filePath }
            try {
                this.isProcessing = true
                const response = await axios.post('/api/certificate/delete', data)
                if (response.status) {
                    swal.fire('Success', response.data.message, 'success')
                    this.getCertificates()
                }
            } catch (error) {
                console.log(error)
            } finally {
                this.isProcessing = false
            }
        },
        async updateSkillTest(status, id) {
            try {
                const response = await axios.put(`/api/skill-test/update/${id}?status=${status}`)
                if (response.status === 200) {
                    swal.fire('Sucess', response.data.message, 'success')
                    this.getSkillTest();
                }
            } catch (error) {
                console.log(error)
            }
        },
        async getStudentInfo() {
            try {
                const response = await axios.get(`/api/profile/get?student_id=${this.studentId}`)
                this.studentInfo = response.data
            } catch (error) {
                console.log(error)
            }
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

.student-title {
    font-family: 'Bangers', cursive;
    font-size: 30px;
}
.video-width {
    width: 320px;
}</style>
