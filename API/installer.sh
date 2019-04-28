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
if [[ $1 == "" ]]; then # This is so I can choose to just update the sherpa script without the rest of this running

	echo -e "${CYAN}===================================================================================${NC}"
	echo ""
	echo -e "${CYAN}              ___         ___         ___         ___         ___         ___
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
	echo -e "${CYAN}===================================================================================${NC}"
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

	while true; do
	    read -p "Is your network a home or enterprise network? [h/e]: " he
	    case $he in
	        [Hh]* ) break;;
	        [Ee]* ) break;;
	        * ) echo -e "${RED}\nPlease answer h or e\n${NC}";;
	    esac
	done

	if [[ "$he" == "h" || "$he" == "H" ]]; then
		# Home WiFi
		read -p "Please enter the name (including spaces) of your home wifi network: " ssid

		echo ""
		# Get password
		echo "Please enter the password for your network"
		echo -n Password: 
		read -s password
	else
		# Enterprise WiFi
		read -p "Please enter the name (including spaces) of your wifi network: " ssid
		read -p "Please enter the usernname (including spaces) for your wifi network: " uname

		echo ""
		# Get password
		echo "Please enter the password for your network"
		echo -n Password: 
		read -s password
	fi

	echo ""
	echo ""
	echo -e "${LPURPLE}Configuring Raspberry Pi....${NC}"
	echo -e "${GREEN}Please connect to the TARS WiFi Network.${NC}"
	echo -e "${GREEN}This should be called: 'TARSSmartMirror'${NC}"
	while true; do
		while true; do
		    read -p "Do you wish to continue? [y/n]: " yn
		    case $yn in
		        [Yy]* ) break;;
		        [Nn]* ) exit;;
		        * ) echo -e "${RED}\nPlease answer y or n\n${NC}";;
		    esac
		done

		if [[ "$OSTYPE" == "linux-gnu" ]]; then
		    # ...
		    echo "Error: I haven't programmed that path yet :("
		elif [[ "$OSTYPE" == "darwin"* ]]; then
		    # Mac OSX
		    check=$(/System/Library/PrivateFrameworks/Apple80211.framework/Versions/Current/Resources/airport -I | awk '/ SSID/ {print substr($0, index($0, $2))}')

		    if [ "$check" != "TARSSmartMirror" ]; then
		    	echo -e "${RED}ERROR: Please connect to the 'TARSSmartMirror' WiFi network.${NC}"
		    else
		    	break
		    fi
		fi
	done

	test=0

	echo ""
	if [ ! -f "~/.ssh/id_rsa.pub" ]; then # Check for ssh public key
		echo -e "${LPURPLE}No SSH public key found${NC}"
	    echo -e "${LPURPLE}Generating SSH key pair....${NC}"
	    ssh-keygen -t rsa -b 2048
	    echo -e "${LPURPLE}Configuring TARS authorized keys....${NC}"
	    ssh-copy-id pi@10.0.0.5
	fi
	#echo "Please enter the passphrase for your Pi (listed in your installation instructions)"


	if [[ "$he" == "h" || "$he" == "H" ]]; then
		# Home WiFi
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
		  sudo reboot & exit
		fi
EOF
		
	else
		# Enterprise WiFi
		# SSH into the Pi
		ssh pi@10.0.0.5 /bin/bash << EOF
		if grep -q '\<$ssid\>' /etc/wpa_supplicant/wpa_supplicant.conf; then
		  test=1
		  echo -e "${RED}ERROR: the network $ssid already is configured in the Pi.${NC}"
		  echo "If you are still having connectivity issues please see instructions for trouble-shooting"
		  exit
		else
		  echo "" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
		  echo "network={" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
		  echo "        ssid=\"$ssid\"" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
		  echo "        key_mgmt=WPA-EAP" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
		  echo "        identity=\"$uname\"" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
		  echo "        password=\"$password\"" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
		  echo "}" | sudo tee -a /etc/wpa_supplicant/wpa_supplicant.conf >/dev/null
		  sudo reboot & exit
		fi
EOF
	fi

	echo $test

	echo -e "${LPURPLE}==> TARS configuration complete! <==${NC}"
	echo ""
	echo -e "${GREEN}See above for possible red error messages.${NC}"
	echo -e "${GREEN}Please wait 1 minute for WiFi configuration to take effect.${NC}"
fi


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