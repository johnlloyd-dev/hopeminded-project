<template>
    <div class="body">
        <div class="d-flex">
            <teacher-sidebar-component @collapse="onCollapse" />
            <div :class="collapsed ? 'collapsed-menu' : 'not-collapsed-menu'" class="main-content mx-5 w-100 h-100">
                <div class="d-flex justify-content-center">
                    <div class="card rounded-0 py-5 px-5" style="width: 100%;">
                        <div class="heading">
                            <h4 class="card-title">Configure Settings</h4>
                        </div>
                        <hr>
                        <!-- Set the passing score -->
                        <div class="passing-score">
                            <div class="mb-3">
                                <h5 class="fw-bold">Passing Percentage</h5>
                                <p>Set the passing score for quizzes and skill tests. Any changes will reflect to the
                                    students' score percentage. </p>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <h6 class="fw-bold">Skill Test</h6>
                                            <div class="d-flex flex-column">
                                                <div v-for="(percentage, index) in percentages" :key="index"
                                                    class="form-check">
                                                    <input @click="updatePassingPercentage('skill_test')"
                                                        v-model="selectedPercentage.skill_test" :value="percentage.value"
                                                        class="form-check-input" type="radio"
                                                        :id="`percentageOptions${index}`">
                                                    <label class="form-check-label fw-bold"
                                                        :for="`percentageOptions${index}`">
                                                        {{ percentage.name }}
                                                    </label>
                                                    <i v-if="percentage.value == selectedPercentage.skill_test"
                                                        class="fas fa-check fa-lg ms-1"></i>
                                                </div>
                                            </div>
                                        </div>
                                        <div class="col-lg-6">
                                            <h6 class="fw-bold">Quiz</h6>
                                            <div class="d-flex flex-column">
                                                <div v-for="(percentage, index) in percentages" :key="index"
                                                    class="form-check">
                                                    <input @click="updatePassingPercentage('quiz')"
                                                        v-model="selectedPercentage.quiz" :value="percentage.value"
                                                        class="form-check-input" type="radio"
                                                        :id="`percentageOptions${index}`">
                                                    <label class="form-check-label fw-bold"
                                                        :for="`percentageOptions${index}`">
                                                        {{ percentage.name }}
                                                    </label>
                                                    <i v-if="percentage.value == selectedPercentage.quiz"
                                                        class="fas fa-check fa-lg ms-1"></i>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr class="w-50">
                        <div class="allowed-skill-test">
                            <div class="mb-3">
                                <h5 class="fw-bold">Number of Skill Test Submissions</h5>
                                <p>Set the required number of skill tests that a student must submit to be able to take a
                                    quiz.
                                </p>
                            </div>
                            <div class="card">
                                <div class="card-body">
                                    <div class="row">
                                        <div class="col-lg-6">
                                            <div v-if="!isEdit" class="d-flex align-items-center">
                                                <p class="mb-0">
                                                    Required Number of Skill Test Submissions:
                                                    <span class="fw-bold text-danger me-2">{{ quantityRequirement?.value ?? 0 }}</span>
                                                    <i @click="isEdit = !isEdit" style="cursor: pointer" class="fas fa-edit"></i>
                                                </p>
                                            </div>
                                            <div v-else>
                                                <label for="exampleFormControlInput1" class="form-label">Please enter a
                                                    number:</label>
                                                <input v-model="value" type="text" class="form-control">
                                                <div class="action-buttons mt-3">
                                                    <button type="button" @click="updateQuantityRequirement()" class="btn btn-primary btn-sm me-3">Save <i class="fas fa-save"></i></button>
                                                    <button type="button" @click="isEdit = !isEdit" class="btn btn-secondary btn-sm">Cancel <i class="fas fa-times-circle"></i></button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import swal from 'sweetalert2'
export default {
    components: {

    },
    data() {
        return {
            collapsed: false,
            quantityRequirementFlag: 'skill_test',
            passingPercentage: [],
            value: 0,
            selectedPercentage: {
                skill_test: null,
                quiz: null
            },
            percentages: [
                { name: '50%', value: 50 },
                { name: '60%', value: 60 },
                { name: '75%', value: 75 },
                { name: '80%', value: 80 }
            ],
            isEdit: false
        }
    },
    computed: {
        ...mapGetters({
            quantityRequirement: 'quantityRequirement'
        })
    },
    created() {
        this.getPassingPercentage()
        this.getQuantityRequirement(this.quantityRequirementFlag).then(() => {
            this.value = this.quantityRequirement.value
        })
    },
    methods: {
        ...mapActions({
            getQuantityRequirement: 'getQuantityRequiement'
        }),
        onCollapse(isCollapsed) {
            if (isCollapsed) {
                this.collapsed = true
            } else {
                this.collapsed = false
            }
        },
        async getPassingPercentage() {
            try {
                const response = await axios.get(`/api/passing-percentage/get`)
                this.passingPercentage = response.data
                this.selectedPercentage.skill_test = response.data['skill_test'].percentage
                this.selectedPercentage.quiz = response.data['quiz'].percentage
            } catch (error) {
                console.log(error)
            }
        },
        async updatePassingPercentage(flag) {
            setTimeout(async () => {
                try {
                    const response = await axios.put(`/api/passing-percentage/update/${this.passingPercentage[flag].id}`, { percentage: this.selectedPercentage[flag] })

                    if (response.status == 200 || response.status == 201) {
                        swal.fire('Success', response.data, 'success')
                        this.getPassingPercentage()
                    }
                } catch (error) {
                    console.log(error)
                }
            }, 500)
        },
        async updateQuantityRequirement() {
            setTimeout(async () => {
                try {
                    const response = await axios.put(`/api/quantity-requirement/update/${this.quantityRequirement.id}`, { value: this.value })

                    if (response.status == 200 || response.status == 201) {
                        swal.fire('Success', response.data, 'success')
                        this.isEdit = !this.isEdit
                        this.getQuantityRequirement(this.quantityRequirementFlag)
                    }
                } catch (error) {
                    console.log(error)
                }
            }, 500)
        }
    }
}
</script>

<style scoped>
.body {
    background-image: url("/images/background.jpg");
    background-size: cover;
    background-repeat: repeat;
    background-attachment: fixed;
    color: #333;
    padding: 0;
    margin: 0;
    height: 100vh;
    overflow-x: hidden;
}

.card {
    background-color: rgba(255, 255, 255, 0.5);
    border: none;
}

.card-title {
    font-weight: bold;
}

.card-sl {
    border-radius: 8px;
    box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 20px 0 rgba(0, 0, 0, 0.19);
    width: 250px;
    height: 270px;
}

.card-image {
    display: flex;
    justify-content: center;
}

.card-image img {
    width: 230px;
    height: 230px;
    border-radius: 8px 8px 0px 0;
}

.card-action {
    position: relative;
    float: right;
    margin-top: -25px;
    margin-right: 20px;
    z-index: 2;
    color: #E26D5C;
    background: #fff;
    border-radius: 50%;
    padding: 15px;
    font-size: 15px;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 1px 2px 0 rgba(0, 0, 0, 0.19);
}

.card-action:hover {
    color: #fff;
    background: #E26D5C;
    animation: pulse 1.5s infinite;
    -webkit-animation: pulse 1.5s infinite;
}

.card-heading {
    font-size: 18px;
    font-weight: bold;
    background: #fff;
    padding: 10px 15px;
    border-radius: 8px;
}

.card-text {
    padding: 10px 15px;
    background: #fff;
    font-size: 14px;
    color: #636262;
}

.card-button {
    display: flex;
    justify-content: center;
    padding: 10px 0;
    width: 100%;
    background-color: #1F487E;
    color: #fff;
    border-radius: 0 0 8px 8px;
}

.card-button:hover {
    text-decoration: none;
    background-color: #1D3461;
    color: #fff;

}

@keyframes pulse {
    0% {
        -moz-transform: scale(0.9);
        -ms-transform: scale(0.9);
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }

    70% {
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        -webkit-transform: scale(1);
        transform: scale(1);
        box-shadow: 0 0 0 50px rgba(90, 153, 212, 0);
    }

    100% {
        -moz-transform: scale(0.9);
        -ms-transform: scale(0.9);
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
        box-shadow: 0 0 0 0 rgba(90, 153, 212, 0);
    }
}

@-webkit-keyframes pulse {
    0% {
        -moz-transform: scale(0.9);
        -ms-transform: scale(0.9);
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
    }

    70% {
        -moz-transform: scale(1);
        -ms-transform: scale(1);
        -webkit-transform: scale(1);
        transform: scale(1);
        box-shadow: 0 0 0 50px rgba(90, 153, 212, 0);
    }

    100% {
        -moz-transform: scale(0.9);
        -ms-transform: scale(0.9);
        -webkit-transform: scale(0.9);
        transform: scale(0.9);
        box-shadow: 0 0 0 0 rgba(90, 153, 212, 0);
    }
}</style>
