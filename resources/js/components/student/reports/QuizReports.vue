<template>
    <div class="body position-relative">
        <div class="d-flex">
            <div class="main-content mx-5 w-100 h-100">
                <button type="button" @click="navigate" class="btn btn-secondary mt-5 rounded-0">
                    Back
                </button>
                <div class="reports mt-5">
                    <h3>{{ cardTitle }}</h3>
                    <div class="card">
                        <div class="card-body">
                            <table class="table table-bordered table-responsive">
                                <thead>
                                    <tr>
                                        <th scope="col">Date/Time</th>
                                        <th scope="col">Score</th>
                                        <th scope="col">Mark</th>
                                    </tr>
                                </thead>
                                <tbody v-if="data.length == 0">
                                    <tr>
                                        <td colspan="4" class="text-center fw-bold">No data found</td>
                                    </tr>
                                </tbody>
                                <tbody v-else>
                                    <tr v-for="item in data" :key="item.id">
                                        <td>{{ new Date(item.created_at).toLocaleString() }}</td>
                                        <td>{{ percentage(item.total_score) }}%</td>
                                        <td>{{ item.mark }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            collapsed: false,
            isProcessing: false,
            data: [],
        };
    },
    created() {
        this.getQuizReports();
    },
    computed: {
        gameId() {
            return this.$route.params.gameId
        },
        cardTitle() {
            if (this.gameId == 1) {
                return 'Hangman Game Quiz Report'
            } else if (this.gameId == 2) {
                return 'Typing Balloon Quiz Report'
            } else if (this.gameId == 3) {
                return 'Memory Game Quiz Report'
            }
        }
    },
    methods: {
        navigate() {
            this.$router.push('/student-report')
        },
        percentage(score) {
            if (this.gameId == 1) {
                return Math.round((score/18) * 100);
            } else if (this.gameId == 2) {
                return Math.round((score/51) * 100);
            } else if (this.gameId == 3) {
                return Math.round((score/59) * 100);
            }
        },
        async getQuizReports() {
            this.isProcessing = true;
            const data = await axios.get("/api/quiz/reports/get");
            this.data = data.data.filter((data) => {
                return data.game_id == this.gameId;
            });
            this.isProcessing = false;
        },
        onCollapse(isCollapsed) {
            if (isCollapsed) {
                this.collapsed = true;
            } else {
                this.collapsed = false;
            }
        },
    },
};
</script>

<style scoped>
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
