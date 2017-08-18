deployment of kubernetes cluster on flanneld network with monitoring solution (based of influxdata stack) and thunderstruck software on it (in devs) :
 - ansible-playbook -i inventory/inventory.kubernetes cluster-kube.yaml --ask-sudo-pass --ask-vault-pass

OR

deployment of swarm cluster with monitoring soluton (based in influxdata stack) and thunderstruck software on it (in devs) :
 - ansible-playbook -i inventory/inventory.swarm cluster-swarm.yaml --ask-sudo-pass --ask-vault-pass

OR

 creation of instances in AWS for project:
  - ansible-playbook create-aws.yaml

 deployment of swarm cluster and thunderstruck  in AWS with dynamic inventory:
  - export AWS_ACCESS_KEY_ID='[YOUR KEY]'
  - export AWS_SECRET_ACCESS_KEY='[YOUR KEY]'
  - ansible -i ec2.py cluster-swarm.yaml -ask-sudo-pass --ask-vault-pass
    
   http://docs.ansible.com/ansible/latest/intro_dynamic_inventory.html#example-aws-ec2-external-inventory-script

 destroy all AWS instances of the project: 
  - ansible-playbook delete-aws.yaml

