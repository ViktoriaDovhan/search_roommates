import { graphqlRequest } from './graphqlClient';

export async function getPublicListingsGraphql({
                                                   search = '',
                                                   city = '',
                                                   genderPreference = '',
                                               } = {}) {
    const query = `
    query PublicListings($search: String, $city: String, $genderPreference: String) {
      publicListings(search: $search, city: $city, genderPreference: $genderPreference) {
        id
        title
        city
        district
        price
        genderPreference
        description
        isActive
        User {
          id
          firstName
          lastName
        }
      }
    }
  `;

    const data = await graphqlRequest(query, { search, city, genderPreference });
    return data.publicListings;
}

export async function createListingGraphql(formData) {
    const query = `
    mutation CreateListing($input: ListingInput!) {
      createListing(input: $input) {
        id
        title
        city
        district
        price
        genderPreference
        description
        isActive
        User {
          id
          firstName
          lastName
        }
      }
    }
  `;

    const data = await graphqlRequest(query, { input: formData });
    return data.createListing;
}

export async function updateListingGraphql(id, formData) {
    const query = `
    mutation UpdateListing($id: Int!, $input: ListingInput!) {
      updateListing(id: $id, input: $input) {
        id
        title
        city
        district
        price
        genderPreference
        description
        isActive
        User {
          id
          firstName
          lastName
        }
      }
    }
  `;

    const data = await graphqlRequest(query, {
        id: Number(id),
        input: formData,
    });

    return data.updateListing;
}

export async function deleteListingGraphql(id) {
    const query = `
    mutation DeleteListing($id: Int!) {
      deleteListing(id: $id) {
        message
      }
    }
  `;

    return graphqlRequest(query, { id: Number(id) });
}

export async function getAdminListingsGraphql() {
    const query = `
    query AdminListings {
      adminListings {
        id
        title
        city
        district
        price
        genderPreference
        description
        isActive
        User {
          id
          firstName
          lastName
          email
        }
      }
    }
  `;

    const data = await graphqlRequest(query);
    return data.adminListings;
}

export async function toggleListingActiveGraphql(id) {
    const query = `
    mutation ToggleListingActive($id: Int!) {
      toggleListingActive(id: $id) {
        id
        title
        city
        district
        price
        genderPreference
        description
        isActive
      }
    }
  `;

    const data = await graphqlRequest(query, { id: Number(id) });
    return data.toggleListingActive;
}

export async function getAdminUsersGraphql() {
    const query = `
    query AdminUsers {
      adminUsers {
        id
        firstName
        lastName
        email
        role
        isVerified
        isActive
      }
    }
  `;

    const data = await graphqlRequest(query);
    return data.adminUsers;
}

export async function getAdminStatsGraphql() {
    const users = await getAdminUsersGraphql();
    const listings = await getAdminListingsGraphql();

    const activeListings = listings.filter((item) => item.isActive).length;
    const inactiveListings = listings.filter((item) => !item.isActive).length;
    const adminUsers = users.filter((item) => item.role === 'admin').length;
    const regularUsers = users.filter((item) => item.role === 'user').length;
    const verifiedUsers = users.filter((item) => item.isVerified).length;
    const unverifiedUsers = users.filter((item) => !item.isVerified).length;

    return {
        totalUsers: users.length,
        totalListings: listings.length,
        activeListings,
        inactiveListings,
        adminUsers,
        regularUsers,
        verifiedUsers,
        unverifiedUsers,
    };
}