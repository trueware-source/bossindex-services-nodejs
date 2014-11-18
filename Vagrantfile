# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "ubuntu-server-trusty"
  config.vm.box_url = "https://cloud-images.ubuntu.com/vagrant/trusty/current/trusty-server-cloudimg-amd64-vagrant-disk1.box"

  config.vm.network :forwarded_port, guest: 3000, host: 3000, auto_correct: true
  config.vm.network :forwarded_port, guest: 27017, host: 27017, auto_correct: true

  # Create a private network, which allows host-only access to the machine using a specific IP.
  config.vm.network :private_network, ip: "192.168.33.10"

  # Create a public network, which generally matched to bridged network. Bridged networks make the machine appear 
  # as another physical device on your network. 
  #config.vm.network :public_network

  config.vm.synced_folder ".", "/vagrant"

  config.vm.provision :shell, path: "./provision/init.sh"

  config.vm.provision :shell, path: "./provision/mongodb.sh"
end
