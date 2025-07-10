<template>
    <div class="flex flex-col items-center">
        <div ref="qrScannerEl" id="qr-reader" class="w-full max-w-md mb-4" />
        <div class="flex gap-4">
            <button
                class="px-4 py-2 rounded text-white"
                :class="log_type === 1 ? 'bg-green-600' : 'bg-gray-400'"
                @click="log_type = 1"
            >
                Clock In
            </button>
            <button
                class="px-4 py-2 rounded text-white"
                :class="log_type === 2 ? 'bg-red-600' : 'bg-gray-400'"
                @click="log_type = 2"
            >
                Clock Out
            </button>
        </div>
        <div
            v-if="feedback"
            :class="
                feedback.type === 'success' ? 'text-green-500' : 'text-red-500'
            "
        >
            {{ feedback.message }}
        </div>

        <div class="w-full max-w-2xl mt-6">
            <h2 class="text-lg font-semibold mb-2">Recent Logs</h2>
            <table class="min-w-full border text-sm text-left">
                <thead class="bg-gray-100">
                    <tr>
                        <th class="border px-4 py-2">Employee</th>
                        <th class="border px-4 py-2">Type</th>
                        <th class="border px-4 py-2">Time</th>
                    </tr>
                </thead>
                <tbody>
                    <tr
                        v-for="log in logs"
                        :key="log.time + log.employee"
                        class="hover:bg-gray-50"
                    >
                        <td class="border px-4 py-2">{{ log.employee }}</td>
                        <td class="border px-4 py-2 capitalize">
                            {{ log.type }}
                        </td>
                        <td class="border px-4 py-2">{{ log.time }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script setup lang="ts">
const qrScannerEl = ref<HTMLDivElement | null>(null);
const feedback = ref<{ type: "success" | "error"; message: string } | null>(
    null
);

const { fetchWithCsrf } = useApi();

const device_name = "test1";
const log_type = ref<1 | 2>(1); // 1 = IN, 2 = OUT
const log_method = 1; // 1 = QR, 2 = Button
const logs = ref<{ employee: string; type: "in" | "out"; time: string }[]>([]);

let html5QrCode: any = null;

const restartScanner = async () => {
    try {
        await html5QrCode.start(
            { facingMode: "environment" },
            { fps: 24, qrbox: 250 },
            onScanSuccess,
            () => {}
        );
    } catch (err) {
        console.error("Scanner restart failed:", err);
    }
};

const onScanSuccess = async (text: string) => {
    try {
        await html5QrCode.stop();

        const res = await fetchWithCsrf<{
            employee: string;
            type: "in" | "out";
            time: string;
        }>("/api/public/attendance-logs", {
            method: "POST",
            body: {
                employee_number: text,
                device_name,
                log_time: new Date()
                    .toISOString()
                    .slice(0, 19)
                    .replace("T", " "),
                log_type: log_type.value,
                log_method,
            },
        });

        feedback.value = {
            type: "success",
            message: `${res.employee} clocked ${res.type.toUpperCase()} at ${
                res.time
            }`,
        };

        logs.value.unshift(res);
        if (logs.value.length > 10) logs.value.pop();
    } catch (err: any) {
        feedback.value = {
            type: "error",
            message: err?.data?.message || "Scan failed.",
        };
    }

    setTimeout(() => restartScanner(), 1000);
};

const fetchLatestLogs = async () => {
     const res = await fetchWithCsrf<{ employee: string; type: "in" | "out"; time: string }[]>(`/api/public/attendance-logs/latest?device_name=${device_name}` , {
            method: "GET",
        });
    logs.value = res;
}

onMounted(async () => {
    // if (!process.client) return;
    await nextTick();
    const { Html5Qrcode } = await import("html5-qrcode");

    if (!qrScannerEl.value) {
        console.error("Scanner element not found");
        return;
    }

    html5QrCode = new Html5Qrcode(qrScannerEl.value.id);
    await restartScanner();

    await fetchLatestLogs();
});

onBeforeUnmount(() => {
    html5QrCode?.stop().catch(() => {});
    html5QrCode?.clear();
});
</script>

<style scoped>
/* #qr-reader {
  border: 2px dashed #999;
  border-radius: 10px;
  min-height: 300px;
} */
</style>
