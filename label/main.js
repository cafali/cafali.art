    const dropZone = document.getElementById("dropZone");
    const fileInput = document.getElementById("fileInput");
    const qrPreview = document.getElementById("qrPreview");
    const labelQrCode = document.getElementById("labelQrCode");
    const previewContainer = document.getElementById("previewContainer");
    const qrStatus = document.getElementById("qrStatus");
    const rawInput = document.getElementById("rawInput");
    const parseButton = document.getElementById("parseButton");
    const copyRawButton = document.getElementById("copyRawButton");
    const copyFullButton = document.getElementById("copyFullButton");
    const clearButton = document.getElementById("clearButton");
    const downloadPngButton = document.getElementById("downloadPngButton");
    const printLabelButton = document.getElementById("printLabelButton");
    const parseStatus = document.getElementById("parseStatus");
    const results = document.getElementById("results");

    const senderInput = document.getElementById("sender");
    const receiverInput = document.getElementById("receiver");
    const code1Input = document.getElementById("code1");
    const code2Input = document.getElementById("code2");

    // Drag and drop setup
    dropZone.addEventListener("click", () => fileInput.click());
    fileInput.addEventListener("change", () => {
        if (fileInput.files.length > 0) decodeQR(fileInput.files[0]);
    });

    dropZone.addEventListener("dragover", (e) => {
        e.preventDefault();
        dropZone.classList.add("dragover");
    });

    dropZone.addEventListener("dragleave", () => dropZone.classList.remove("dragover"));
    dropZone.addEventListener("drop", (e) => {
        e.preventDefault();
        dropZone.classList.remove("dragover");
        if (e.dataTransfer.files.length > 0) decodeQR(e.dataTransfer.files[0]);
    });

    function decodeQR(file) {
        if (!file.type.startsWith("image/")) {
            setQRStatus("Please upload a valid image asset.", "error");
            return;
        }

        setQRStatus("Reading image matrix...", "loading");

        const reader = new FileReader();
        reader.onload = (event) => {
            qrPreview.src = event.target.result;
            labelQrCode.src = event.target.result;
            labelQrCode.classList.add("visible");
            previewContainer.classList.add("visible");

            const image = new Image();
            image.onload = () => {
                const canvas = document.createElement("canvas");
                const context = canvas.getContext("2d", { willReadFrequently: true });
                canvas.width = image.naturalWidth;
                canvas.height = image.naturalHeight;
                context.drawImage(image, 0, 0, canvas.width, canvas.height);

                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height, { inversionAttempts: "attemptBoth" });

                if (!code) {
                    setQRStatus("No actionable QR payload recognized.", "error");
                    return;
                }

                rawInput.value = code.data;
                parseData();
                setQRStatus("QR stream processed successfully.", "success");
            };
            image.onerror = () => setQRStatus("Failed processing image data.", "error");
            image.src = event.target.result;
        };
        reader.onerror = () => setQRStatus("Could not read file stream.", "error");
        reader.readAsDataURL(file);
    }

    rawInput.addEventListener("input", () => {
        if (rawInput.value.trim() !== "") parseData();
        else results.classList.add("hidden");
    });

    parseButton.addEventListener("click", parseData);

    function parseData() {
        const raw = rawInput.value.trim();
        if (!raw) {
            results.classList.add("hidden");
            setParseStatus("", "");
            return;
        }

        const fields = raw.split("|");

        const code1 = getField(fields, 1);
        const code2 = getField(fields, 2);

        const senderName = getField(fields, 9);
        const senderZip = getField(fields, 13);
        const senderCity = getField(fields, 14);
        const senderAddress = getField(fields, 15);

        const receiverName = getField(fields, 18);
        const receiverZip = getField(fields, 22);
        const receiverCity = getField(fields, 23);
        const receiverAddress = getField(fields, 24);

        const sender = [senderName, senderAddress, formatLocation(senderZip, senderCity)].filter(Boolean).join("\n");
        const receiver = [receiverName, receiverAddress, formatLocation(receiverZip, receiverCity)].filter(Boolean).join("\n");

        senderInput.value = sender;
        document.getElementById("labelSender").textContent = sender;

        receiverInput.value = receiver;
        document.getElementById("labelReceiver").textContent = receiver;

        code1Input.value = code1;
        code2Input.value = code2;

        updateBarcodes(code1, code2);

        document.getElementById("rawOutput").textContent = raw;
        results.classList.remove("hidden");
        setParseStatus("Data layout successfully mapped.", "success");
    }

    // Real-time synchronization
    senderInput.addEventListener("input", () => {
        document.getElementById("labelSender").textContent = senderInput.value;
    });

    receiverInput.addEventListener("input", () => {
        document.getElementById("labelReceiver").textContent = receiverInput.value;
    });

    code1Input.addEventListener("input", () => updateBarcodes(code1Input.value.trim(), code2Input.value.trim()));
    code2Input.addEventListener("input", () => updateBarcodes(code1Input.value.trim(), code2Input.value.trim()));

    function updateBarcodes(c1, c2) {
        try {
            if (c1) {
                JsBarcode("#barcode1Svg", c1, { format: "CODE128", width: 1.8, height: 45, displayValue: true, fontSize: 11, margin: 2 });
            } else {
                document.getElementById("barcode1Svg").innerHTML = "";
            }

            if (c2) {
                JsBarcode("#barcode2Svg", c2, { format: "CODE128", width: 1.8, height: 45, displayValue: true, fontSize: 11, margin: 2 });
            } else {
                document.getElementById("barcode2Svg").innerHTML = "";
            }
        } catch (e) {
            console.error("Barcode generation error:", e);
        }
    }

    function getField(fields, index) {
        if (index < 0 || index >= fields.length) return "";
        return fields[index].trim();
    }

    function formatLocation(zip, city) {
        if (zip && city) return `${zip}, ${city}`;
        if (zip) return zip;
        if (city) return city;
        return "";
    }

    async function copyField(id) {
        const element = document.getElementById(id);
        const text = element.value || element.textContent;
        if (text) await copyText(text);
    }

    async function copyText(text) {
        try {
            await navigator.clipboard.writeText(text);
        } catch (err) {
            console.error('Clipboard error: ', err);
        }
    }

    copyRawButton.addEventListener("click", async () => {
        if (rawInput.value.trim()) await copyText(rawInput.value.trim());
    });

    copyFullButton.addEventListener("click", async () => {
        const rawOutputText = document.getElementById("rawOutput").textContent;
        if (rawOutputText) await copyText(rawOutputText);
    });

    clearButton.addEventListener("click", () => {
        rawInput.value = "";
        previewContainer.classList.remove("visible");
        qrPreview.src = "";
        labelQrCode.src = "";
        labelQrCode.classList.remove("visible");
        fileInput.value = "";
        results.classList.add("hidden");
        setQRStatus("", "");
        setParseStatus("", "");
    });

    function setQRStatus(msg, type) {
        qrStatus.textContent = msg;
        qrStatus.className = "status-text " + type;
    }

    function setParseStatus(msg, type) {
        parseStatus.textContent = msg;
        parseStatus.className = "status-text " + type;
    }

    downloadPngButton.addEventListener("click", () => {
        const label = document.querySelector("#labelCaptureArea .retour-label");
        html2canvas(label, { scale: 3.125, useCORS: true, backgroundColor: "#ffffff" }).then((canvas) => {
            const imageURL = canvas.toDataURL("image/png");
            const downloadLink = document.createElement("a");
            downloadLink.href = imageURL;
            downloadLink.download = "shipping-return-label-100x180mm.png";
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
        });
    });

    printLabelButton.addEventListener("click", () => window.print());