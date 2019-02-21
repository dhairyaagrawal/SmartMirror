#!/usr/bin/env bash

RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
LPURPLE='\033[0;35m'
NC='\033[0m' # No Color

: '
Black        0;30     Dark Gray     1;30
Red          0;31     Light Red     1;31
Green        0;32     Light Green   1;32
Brown/Orange 0;33     Yellow        1;33
Blue         0;34     Light Blue    1;34
Purple       0;35     Light Purple  1;35
Cyan         0;36     Light Cyan    1;36
Light Gray   0;37     White         1;37
'

# Place the sherpa script into the user's binaries folder
sudo cp ./sherpa /usr/local/bin/

echo -e "${CYAN}===========================================================================${NC}"
echo ""
echo -e "${CYAN}      ___         ___         ___         ___         ___         ___     
     /\  \       /\__\       /\  \       /\  \       /\  \       /\  \    
    /::\  \     /:/  /      /::\  \     /::\  \     /::\  \     /::\  \   
   /:/\ \  \   /:/__/      /:/\:\  \   /:/\:\  \   /:/\:\  \   /:/\:\  \  
  _\:\~\ \  \ /::\  \ ___ /::\~\:\  \ /::\~\:\  \ /::\~\:\  \ /::\~\:\  \ 
 /\ \:\ \ \__/:/\:\  /\__/:/\:\ \:\__/:/\:\ \:\__/:/\:\ \:\__/:/\:\ \:\__\ 
 \:\ \:\ \/__\/__\:\/:/  \:\~\:\ \/__\/_|::\/:/  \/__\:\/:/  \/__\:\/:/  /
  \:\ \:\__\      \::/  / \:\ \:\__\    |:|::/  /     \::/  /     \::/  / 
   \:\/:/  /      /:/  /   \:\ \/__/    |:|\/__/       \/__/      /:/  /  
    \::/  /      /:/  /     \:\__\      |:|  |                   /:/  /   
     \/__/       \/__/       \/__/       \|__|                   \/__/    "
echo ""
echo -e "${CYAN}===========================================================================${NC}"
echo ""
echo "Thank you for installing Sherpa package manager for the TARS Smart Mirror"
echo ""
echo "Please follow the prompts below"
echo ""
while true; do
    read -p "Do you wish to continue with the installation? [y/n]: " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) exit;;
        * ) echo -e "${RED}\nPlease answer y or n\n${NC}";;
    esac
done

# Gather info
read -p "Please enter the name (including spaces) of your home wifi network: " ssid

echo ""
# Get password
echo "Please enter the password for your network"
echo -n Password: 
read -s password

echo ""
echo "ssid: $ssid"
echo "Password: $password"
echo ""

echo "Configuring Raspberry Pi...."
echo ""
echo -e "${GREEN}Please connect to the TARS WiFi Network.${NC}"
echo -e "${GREEN}This should be called: 'TARSSmartMirror'${NC}"
while true; do
    read -p "Are you connected to the TARS Network? [y/n]: " yn
    case $yn in
        [Yy]* ) break;;
        [Nn]* ) exit;;
        * ) echo -e "${RED}\nPlease answer y or n\n${NC}";;
    esac
done
echo ""
echo "Please enter the passphrase for your Pi (listed in your intallation instructions)"

# SSH into the Pi
ssh pi@10.0.0.5 /bin/bash << EOF
if grep -q '\<$ssid\>' /etc/wpa_supplicant/wpa_supplicant.conf; then
  echo "ERROR: the network $ssid already is configured in the Pi."
  echo "If you are still having connectivity issues please see instructions for trouble-shooting"
  exit
else
  echo "" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
  echo "network={" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
  echo "        ssid=\"$ssid\"" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
  echo "        psk=\"$password\"" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
  echo "        key_mgmt=WPA-PSK" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
  echo "}" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
  exit
fi
EOF

#echo "" >> /etc/wpa_supplicant/wpa_supplicant.conf
#echo "network={" >> /etc/wpa_supplicant/wpa_supplicant.conf





# OLD CODE

# Discover Pi's IP Addr

# Extract Subnet Mask
#subnet=$((ifconfig | grep -A1 "wlan0" || ifconfig | grep -A1 "en0") | grep -oE "inet \b([0-9]{1,3}\.){3}[0-9]{1,3}\b" | grep -oE "\b([0-9]{1,3}\.){3}\b")

#piip=$(sudo nmap -sP -PS22,3389 "$subnet"1/24 2> /dev/null || (brew update && brew install nmap && sudo nmap -sP -PS22,3389 "$subnet"1/24))
#echo "$piip"
#PIIP=$(echo "$piip" | grep -B2 "Raspberry")

#echo "$PIIP"