import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import * as GriseToken from './abi/GriseToken.json';
import Web3 from "web3"

declare let window: any;


@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
@Injectable({ providedIn: 'root' })
export class AppComponent {
  isContractLoadOnNetwork: boolean;
  blankReferralAccountNo: string;
  toastrService: ToastrService;

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum);
      await window.ethereum.enable();
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider);
    } else {
      this.toastrService.error(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      );
    }
  }

  constructor() {
    this.loadWeb3();
    this.blankReferralAccountNo = '0x0000000000000000000000000000000000000000';
  }

  async getContractObject(currentAbis: any): Promise<any> {
    try {
      const web3 = window.web3;

      if (web3 != undefined && web3 != null) {
        const networkId = await web3.eth.net.getId();
        const networks: { [key: string]: any } = currentAbis.default.networks;
        const contractData = networks[networkId];
        if (contractData) {
          this.isContractLoadOnNetwork = true;
          return new web3.eth.Contract(
            currentAbis.default.abi,
            contractData.address
          );
          // setHomeContract(hdc);
        } else {
          this.isContractLoadOnNetwork = false;
          const toastMessage =
            'Contract not deployed on BSC mainnet, Please change network to BSC Testnet and refresh page.';
          if (toastMessage != this.toastrService.previousToastMessage)
            this.toastrService.error(toastMessage);
        }
      }
    } catch (ex) {
      this.toastrService.error(ex);
    }
    return null;
  }

  Contract = this.getContractObject(GriseToken);
}
