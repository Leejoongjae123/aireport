import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const status = searchParams.get('status');
    const searchType = searchParams.get('searchType');
    const searchValue = searchParams.get('searchValue');

    const supabase = await createClient();
    
    let query = supabase
      .from('consulting_requests')
      .select(`
        id,
        created_at,
        updated_at,
        report_uuid,
        user_id,
        expert_request_id,
        expert_id,
        request_subject,
        detailed_requirements,
        attachment_urls,
        status,
        profiles!consulting_requests_user_id_fkey (
          name,
          email
        ),
        report_create!consulting_requests_report_uuid_fkey (
          title,
          business_field
        ),
        expert_informations!consulting_requests_expert_id_fkey (
          name
        )
      `, { count: 'exact' });

    if (startDate) {
      query = query.gte('created_at', new Date(startDate).toISOString());
    }
    if (endDate) {
      query = query.lte('created_at', new Date(endDate + 'T23:59:59').toISOString());
    }

    if (status) {
      query = query.eq('status', status);
    }

    if (searchValue) {
      switch (searchType) {
        case 'user_name':
          query = query.ilike('profiles.name', `%${searchValue}%`);
          break;
        case 'user_email':
          query = query.ilike('profiles.email', `%${searchValue}%`);
          break;
        case 'report_title':
          query = query.ilike('report_create.title', `%${searchValue}%`);
          break;
        case 'expert_name':
          query = query.ilike('expert_informations.name', `%${searchValue}%`);
          break;
      }
    }

    const offset = (page - 1) * limit;
    query = query
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data, error, count } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const formattedData = data?.map((item: any) => ({
      id: item.id.toString(),
      created_at: item.created_at,
      updated_at: item.updated_at,
      report_uuid: item.report_uuid,
      user_id: item.user_id,
      expert_request_id: item.expert_request_id,
      expert_id: item.expert_id,
      request_subject: item.request_subject,
      detailed_requirements: item.detailed_requirements,
      attachment_urls: item.attachment_urls,
      status: item.status,
      user_name: item.profiles?.name || null,
      user_email: item.profiles?.email || null,
      report_title: item.report_create?.title || null,
      report_business_field: item.report_create?.business_field || null,
      expert_name: item.expert_informations?.name || null,
    })) || [];

    return NextResponse.json({
      data: formattedData,
      total: count || 0,
      page,
      limit,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
