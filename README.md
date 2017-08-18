deployment of kubernetes cluster on flanneld network with monitoring solution (based of influxdata stack) and thunderstruck software on it (in devs) :
 - ansible-playbook -i inventory/inventory.kubernetes cluster-kube.yaml --ask-sudo-pass --ask-vault-pass

OR

deployment of swarm cluster with monitoring soluton (based in influxdata stack) and thunderstruck software on it (in devs) :
 - ansible-playbook -i inventory/inventory.swarm cluster-swarm.yaml --ask-sudo-pass --ask-vault-pass

OR

 creation of instances in AWS for project 
  - ansible-playbook creation.yaml

 deployment of swarm cluster and thunderstruck  in AWS with dynamic inventory
  - export AWS_ACCESS_KEY_ID='AK123'
  - export AWS_SECRET_ACCESS_KEY='abc123'
  - ansible -i ec2.py cluster-swarm.yaml -ask-sudo-pass --ask-vault-pass  ------> NEED boto python module : pip install boto
