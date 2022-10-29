# GCP IAM

## Term

- ### Principal

  A principal can be a

  - google account (for end users)
  - service account (for applications and compute workloads)
  - google group
  - google workspace account
  - cloud identity domain that can access a resource.

  The `identity` of a principal is an `email address` associated with a user, service account, or Google group; or a `domain name` associated with a Google Workspace account or a Cloud Identity domain.

- ### Role

  - `roles/${resource}.${role}`
  - `roles/${resource}.${resourceId}.${role}`

  A role is a collection of permissions. Permissions determine what operations are allowed on a resource. When you grant a role to a principal, you grant all the permissions that the role contains.

  - #### Basic roles

    - Owner
    - Editor
    - Viewer

  - #### Predefined roles
    - e.g. roles/pubsub.publisher
  - #### Custom roles

- ### [IAM policy](https://cloud.google.com/iam/docs/overview#cloud-iam-and-policy-apis)

  #### Binding:

  ```json
  {
    "role": "roles/storage.objectAdmin",
    "members": [
      "user:ali@example.com",
      "serviceAccount:my-other-app@appspot.gserviceaccount.com",
      "group:admins@example.com",
      "domain:google.com"
    ]
  }
  ```

  The IAM policy is a collection of role bindings that bind one or more principals to individual roles. When you want to define who (principal) has what type of access (role) on a resource, you create a policy and attach it to the resource.

- ### [IAM Resource hierarchy](https://cloud.google.com/iam/docs/overview#resource-hierarchy)

  - Organization
  - Folder
  - Project
  - Service(Resource)

  The effective policy for a resource is the union of the policy set on that resource and the policies inherited from higher up in the hierarchy.

---

# AWS IAM

## Terms

- ### IAM Resources

  The user, group, role, policy, and identity provider objects that are stored in IAM.

- ### IAM Identities

  You can attach a policy to an IAM identity, including users, groups, and roles.

- ### IAM Entities

  The IAM resource objects that AWS uses for authentication. These include IAM users and roles.

---

## Comparing

|                |                            GCP                             |                      AWS                      |
| :------------: | :--------------------------------------------------------: | :-------------------------------------------: |
|       -        |                       google account                       |                   iam user                    |
|       -        |                      service account                       |                   iam role                    |
|       -        |                         _members_                          |                    _group_                    |
|       -        |                           _Role_                           |                  permission                   |
|     policy     | A list of bindings that binds a list of members to a role. | A document that explicitly lists permissions. |
| policy target  |                         _resource_                         |                  _identity_                   |
| custom policy  |              from existing list permissions.               |                  JSON config                  |
| policy version |                             X                              |                       O                       |

---

## Reference

- #### [GCP Official Document](https://cloud.google.com/iam/docs/overview)

- #### [AWS Official Document](https://docs.aws.amazon.com/IAM/latest/UserGuide/introduction.html)

- #### [Comparing Google IAM with AWS IAM](https://www.stratoscale.com/blog/compute/comparing-google-iam-aws-iam/)
