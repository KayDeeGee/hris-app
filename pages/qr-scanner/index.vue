<template>
    <div class="flex flex-col items-center">
        <div ref="qrScannerEl" id="qr-reader" class="w-full max-w-md mb-4" />

        <div
            v-if="feedback"
            :class="
                feedback.type === 'success' ? 'text-green-500' : 'text-red-500'
            "
        >
            {{ feedback.message }}
        </div>
    </div>
</template>

<script setup lang="ts">
const qrScannerEl = ref<HTMLDivElement | null>(null);
const feedback = ref<{ type: "success" | "error"; message: string } | null>(
    null
);

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
        const res = await $fetch<{
            employee: string;
            type: "in" | "out";
            time: string;
        }>("/api/clock", {
            method: "POST",
            body: { qr: text },
        });

        feedback.value = {
            type: "success",
            message: `${res.employee} clocked ${res.type.toUpperCase()} at ${
                res.time
            }`,
        };
    } catch (err: any) {
        feedback.value = {
            type: "error",
            message: err?.data?.message || "Scan failed.",
        };
    }

    await html5QrCode.stop();
    setTimeout(() => restartScanner(), 1000);
};

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
