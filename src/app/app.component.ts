import { Component, OnDestroy } from '@angular/core';
import { BrowserMultiFormatReader, IScannerControls } from '@zxing/browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnDestroy {
  title = 'WaiziMartPOS';
  private codeReader = new BrowserMultiFormatReader();
  private controls: IScannerControls | null = null;

  scanResult: string | null = null;
  isScanning: boolean = false;

  async startScan() {
    try {
      // ✅ call static method here
      const devices = await BrowserMultiFormatReader.listVideoInputDevices();

      if (devices.length === 0) {
        this.scanResult = 'No camera found';
        return;
      }

      const backCamera = devices.find(d => /back|rear|environment/i.test(d.label));
      const selectedDeviceId = backCamera ? backCamera.deviceId : devices[0].deviceId;

      this.controls = await this.codeReader.decodeFromVideoDevice(
        selectedDeviceId,
        'video',
        (result, error) => {
          if (result) {
            this.scanResult = result.getText();
            console.log('Scanned:', this.scanResult);
          }
        }
      );

      this.isScanning = true;
    } catch (err) {
      this.scanResult = 'Camera error: ' + (err as any).message;
    }
  }

  stopScan() {
    if (this.controls) {
      this.controls.stop();
      this.controls = null;
    }
    this.isScanning = false;
  }

  ngOnDestroy(): void {
    this.stopScan();
  }
}
