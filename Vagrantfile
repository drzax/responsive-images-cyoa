Vagrant.configure("2") do |config|
  config.vm.box = "lucid32"
  config.vm.provision :shell, :path => "bootstrap.sh"
  config.vm.network :private_network, ip: "192.168.33.13"
end