<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 p-6">
    <div class="max-w-7xl w-full mx-auto">
      <div class="card p-6 bg-white dark:bg-gray-800 shadow-lg rounded-lg h-full flex flex-col">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Donation Overview</h2>
        
        <!-- Quarterly Donations Summary -->
        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div v-for="(donation, index) in quarterlyDonations" :key="index" class="p-4 bg-blue-100 dark:bg-blue-800 rounded-lg text-center">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Q{{ index + 1 }}</h3>
            <p class="text-xl font-bold text-gray-700 dark:text-gray-300">${{ donation.toFixed(2) }}</p>
          </div>
        </div>
        
        <div class="flex flex-wrap gap-4 mb-4">
          <input type="date" v-model="startDate" class="p-2 border rounded w-full sm:w-auto" />
          <input type="date" v-model="endDate" class="p-2 border rounded w-full sm:w-auto" />
          <button @click="fetchChartData" class="p-2 bg-blue-500 hover:bg-blue-600 text-white rounded w-full sm:w-auto">
            Update
          </button>
        </div>
        <div class="relative overflow-auto max-h-[40rem]">
          <Chart type="bar" :data="chartData" :options="chartOptions" class="h-[20rem] w-full" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import Chart from "primevue/chart";
import { ref, onMounted, watch } from "vue";
import { HTTP } from "../store";
import { getAuth } from "firebase/auth";
import { store } from "../store"; // Ensure this correctly imports the store

const chartData = ref({ labels: [], datasets: [] });
const chartOptions = ref();
const quarterlyDonations = ref([0, 0, 0, 0]);
const churchId = ref(store.church?._id);
const startDate = ref(new Date(new Date().setMonth(new Date().getMonth() - 6)).toISOString().split('T')[0]);
const endDate = ref(new Date().toISOString().split('T')[0]);

onMounted(() => {
    if (churchId.value) {
        fetchChartData();
        fetchQuarterlyDonations();
    } else {
        watch(() => store.church, (newChurch) => {
            if (newChurch) {
                churchId.value = newChurch._id.$oid;
                fetchChartData();
                fetchQuarterlyDonations();
            }
        }, { immediate: true });
    }
});

async function fetchChartData() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        console.error("User not authenticated");
        return;
    }

    const token = await user.getIdToken();
    if (!churchId.value) {
        console.error("No church found");
        return;
    }

    const start = new Date(startDate.value).getTime().toString();
    const end = new Date(endDate.value).getTime().toString();

    try {
        const response = await HTTP.post(`/churches/${churchId.value}/monthly_donations`, {
          start: {
            $date: {
              $numberLong: start,
            },
          },
          end: {
            $date: {
              $numberLong: end,
            },
          }
        }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        chartData.value = transformChartData(response.data);
    } catch (error) {
        console.error("Failed to fetch chart data:", error);
    }
}

function transformChartData(apiData) {
    return {
        labels: apiData.labels,
        datasets: apiData.datasets.map(dataset => ({
            type: dataset.type,
            label: dataset.label,
            backgroundColor: dataset.backgroundColor,
            data: dataset.data
        }))
    };
}

const setChartOptions = () => {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    return {
        maintainAspectRatio: false,
        aspectRatio: 0.8,
        responsive: true,
        plugins: {
            tooltip: {
                mode: 'index',
                intersect: false
            },
            legend: {
                labels: {
                    color: textColor
                }
            }
        },
        scales: {
            x: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            },
            y: {
                stacked: true,
                ticks: {
                    color: textColorSecondary
                },
                grid: {
                    color: surfaceBorder
                }
            }
        }
    };
};

chartOptions.value = setChartOptions();

async function fetchQuarterlyDonations() {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) {
        console.error("User not authenticated");
        return;
    }

    const token = await user.getIdToken();
    if (!churchId.value) {
        console.error("No church found");
        return;
    }

    const currentYear = new Date().getFullYear();
    const quarters = [
        new Date(currentYear, 0, 1),
        new Date(currentYear, 3, 1),
        new Date(currentYear, 6, 1),
        new Date(currentYear, 9, 1)
    ];
    
    for (let i = 0; i < quarters.length; i++) {
        const start = quarters[i].getTime().toString();
        const end = (i < 3 ? quarters[i + 1] : new Date()).getTime().toString();

        try {
            const response = await HTTP.post(`/churches/${churchId.value}/total_donations`, {
                start: { $date: { $numberLong: start } },
                end: { $date: { $numberLong: end } }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            quarterlyDonations.value[i] = response.data;
        } catch (error) {
            console.error(`Failed to fetch donations for Q${i + 1}:`, error);
        }
    }
}
</script>

